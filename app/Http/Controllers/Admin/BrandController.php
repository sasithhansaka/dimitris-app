<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandStoreRequest;
use App\Http\Requests\Admin\BrandUpdateRequest;
use App\Models\Brand;
use App\Models\Distributor;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    /**
     * Display a paginated, searchable listing of brands.
     */
    public function index(Request $request): Response
    {
        $query = Brand::query()->with('distributors');

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [Brand::STATUS_ACTIVE, Brand::STATUS_INACTIVE, Brand::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $brands = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/brands/index', [
            'brands' => $brands,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new brand.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/brands/create', [
            'distributors' => Distributor::query()
                ->where('status', Distributor::STATUS_ACTIVE)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created brand.
     */
    public function store(BrandStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $distributorIds = $data['distributor_ids'];
        unset($data['distributor_ids']);

        if ($request->hasFile('logo')) {
            $data['logo'] = $this->storeLogo($request->file('logo'));
        }

        $brand = Brand::create($data);
        $brand->distributors()->sync($distributorIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Brand created.')]);

        return to_route('brands.index');
    }

    /**
     * Display the specified brand.
     */
    public function show(Brand $brand): Response
    {
        return Inertia::render('Admin/brands/show', [
            'brand' => $brand->load([
                'distributors' => fn ($query) => $query->where('status', Distributor::STATUS_ACTIVE),
                'products' => fn ($query) => $query->where('status', Product::STATUS_ACTIVE),
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified brand.
     */
    public function edit(Brand $brand): Response
    {
        $brand->load('distributors:id')->loadCount('products');
        $linkedIds = $brand->distributors->pluck('id');

        return Inertia::render('Admin/brands/edit', [
            'brand' => $brand,
            'distributors' => Distributor::query()
                ->where('status', Distributor::STATUS_ACTIVE)
                ->orWhereIn('id', $linkedIds)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified brand.
     */
    public function update(BrandUpdateRequest $request, Brand $brand): RedirectResponse
    {
        $data = $request->validated();
        $distributorIds = $data['distributor_ids'];
        unset($data['distributor_ids'], $data['remove_logo']);

        if ($request->hasFile('logo')) {
            $this->deleteLogo($brand);
            $data['logo'] = $this->storeLogo($request->file('logo'));
        } elseif ($request->boolean('remove_logo')) {
            $this->deleteLogo($brand);
            $data['logo'] = null;
        } else {
            unset($data['logo']);
        }

        $brand->update($data);
        $brand->distributors()->sync($distributorIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Brand updated.')]);

        return to_route('brands.index');
    }

    /**
     * Remove the specified brand.
     */
    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->products()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('This brand cannot be deleted because it is linked to one or more products.'),
            ]);

            return to_route('brands.index');
        }

        $brand->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Brand deleted.')]);

        return to_route('brands.index');
    }

    /**
     * Store the uploaded logo image and return its public storage path.
     */
    private function storeLogo(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('brands', $filename, 'public');

        return "brands/{$filename}";
    }

    /**
     * Delete the brand's current logo file from storage, if any.
     */
    private function deleteLogo(Brand $brand): void
    {
        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
        }
    }
}
