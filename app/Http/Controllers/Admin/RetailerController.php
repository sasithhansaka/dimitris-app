<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RetailerStoreRequest;
use App\Http\Requests\Admin\RetailerUpdateRequest;
use App\Models\Product;
use App\Models\Retailer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RetailerController extends Controller
{
    /**
     * Display a paginated, searchable listing of retailers.
     */
    public function index(Request $request): Response
    {
        $query = Retailer::query()->with('products');

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $statuses = [Retailer::STATUS_ACTIVE, Retailer::STATUS_INACTIVE, Retailer::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $retailers = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/retailers/index', [
            'retailers' => $retailers,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new retailer.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/retailers/create', [
            'products' => Product::query()
                ->where('status', Product::STATUS_ACTIVE)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created retailer.
     */
    public function store(RetailerStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $productIds = $data['product_ids'];
        unset($data['product_ids']);

        if ($request->hasFile('logo')) {
            $data['logo'] = $this->storeLogo($request->file('logo'));
        }

        $retailer = Retailer::create($data);
        $retailer->products()->sync($productIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Retailer created.')]);

        return to_route('retailers.index');
    }

    /**
     * Display the specified retailer.
     */
    public function show(Retailer $retailer): Response
    {
        return Inertia::render('Admin/retailers/show', [
            'retailer' => $retailer->load('products'),
        ]);
    }

    /**
     * Show the form for editing the specified retailer.
     */
    public function edit(Retailer $retailer): Response
    {
        $retailer->load('products:id');
        $linkedIds = $retailer->products->pluck('id');

        return Inertia::render('Admin/retailers/edit', [
            'retailer' => $retailer,
            'products' => Product::query()
                ->where(function ($query) use ($linkedIds) {
                    $query->where('status', Product::STATUS_ACTIVE)
                        ->orWhereIn('id', $linkedIds);
                })
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified retailer.
     */
    public function update(RetailerUpdateRequest $request, Retailer $retailer): RedirectResponse
    {
        $data = $request->validated();
        $productIds = $data['product_ids'];
        unset($data['product_ids'], $data['remove_logo']);

        if ($request->hasFile('logo')) {
            $this->deleteLogo($retailer);
            $data['logo'] = $this->storeLogo($request->file('logo'));
        } elseif ($request->boolean('remove_logo')) {
            $this->deleteLogo($retailer);
            $data['logo'] = null;
        } else {
            unset($data['logo']);
        }

        $retailer->update($data);
        $retailer->products()->sync($productIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Retailer updated.')]);

        return to_route('retailers.index');
    }

    /**
     * Remove the specified retailer.
     */
    public function destroy(Retailer $retailer): RedirectResponse
    {
        $retailer->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Retailer deleted.')]);

        return to_route('retailers.index');
    }

    /**
     * Store the uploaded logo image and return its public storage path.
     */
    private function storeLogo(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('retailers', $filename, 'public');

        return "retailers/{$filename}";
    }

    /**
     * Delete the retailer's current logo file from storage, if any.
     */
    private function deleteLogo(Retailer $retailer): void
    {
        if ($retailer->logo) {
            Storage::disk('public')->delete($retailer->logo);
        }
    }
}
