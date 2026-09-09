<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DistributorStoreRequest;
use App\Http\Requests\Admin\DistributorUpdateRequest;
use App\Models\Brand;
use App\Models\Distributor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DistributorController extends Controller
{
    /**
     * Display a paginated, searchable listing of distributors.
     */
    public function index(Request $request): Response
    {
        $query = Distributor::query();

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('distributor_code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('country', 'like', "%{$search}%");
            });
        }

        $statuses = [Distributor::STATUS_ACTIVE, Distributor::STATUS_INACTIVE, Distributor::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $distributors = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/distributors/index', [
            'distributors' => $distributors,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new distributor.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/distributors/create', [
            'nextDistributorCode' => Distributor::nextDistributorCode(),
        ]);
    }

    /**
     * Store a newly created distributor.
     */
    public function store(DistributorStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo'] = $this->storeLogo($request->file('logo'));
        }

        Distributor::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Distributor created.')]);

        return to_route('distributors.index');
    }

    /**
     * Display the specified distributor.
     */
    public function show(Distributor $distributor): Response
    {
        return Inertia::render('Admin/distributors/show', [
            'distributor' => $distributor->load([
                'brands' => fn ($query) => $query->where('status', Brand::STATUS_ACTIVE),
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified distributor.
     */
    public function edit(Distributor $distributor): Response
    {
        $distributor->loadCount('brands');

        return Inertia::render('Admin/distributors/edit', [
            'distributor' => $distributor,
        ]);
    }

    /**
     * Update the specified distributor.
     */
    public function update(DistributorUpdateRequest $request, Distributor $distributor): RedirectResponse
    {
        $data = $request->validated();
        unset($data['remove_logo']);

        if ($request->hasFile('logo')) {
            $this->deleteLogo($distributor);
            $data['logo'] = $this->storeLogo($request->file('logo'));
        } elseif ($request->boolean('remove_logo')) {
            $this->deleteLogo($distributor);
            $data['logo'] = null;
        } else {
            unset($data['logo']);
        }

        $distributor->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Distributor updated.')]);

        return to_route('distributors.index');
    }

    /**
     * Remove the specified distributor.
     */
    public function destroy(Distributor $distributor): RedirectResponse
    {
        if ($distributor->brands()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('This distributor cannot be deleted because it is linked to one or more brands.'),
            ]);

            return to_route('distributors.index');
        }

        $distributor->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Distributor deleted.')]);

        return to_route('distributors.index');
    }

    /**
     * Store the uploaded logo image and return its public storage path.
     */
    private function storeLogo(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('distributors', $filename, 'public');

        return "distributors/{$filename}";
    }

    /**
     * Delete the distributor's current logo file from storage, if any.
     */
    private function deleteLogo(Distributor $distributor): void
    {
        if ($distributor->logo) {
            Storage::disk('public')->delete($distributor->logo);
        }
    }
}
