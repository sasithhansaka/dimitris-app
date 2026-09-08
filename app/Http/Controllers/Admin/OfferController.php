<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OfferStoreRequest;
use App\Http\Requests\Admin\OfferUpdateRequest;
use App\Models\Brand;
use App\Models\Offer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    /**
     * Display a paginated, searchable listing of offers.
     */
    public function index(Request $request): Response
    {
        $query = Offer::query()->with('brand');

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [Offer::STATUS_ACTIVE, Offer::STATUS_INACTIVE, Offer::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $offers = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/offers/index', [
            'offers' => $offers,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new offer.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/offers/create', [
            'brands' => Brand::query()
                ->where('status', Brand::STATUS_ACTIVE)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created offer.
     */
    public function store(OfferStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'));
        }

        Offer::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Offer created.')]);

        return to_route('offers.index');
    }

    /**
     * Display the specified offer.
     */
    public function show(Offer $offer): Response
    {
        return Inertia::render('Admin/offers/show', [
            'offer' => $offer->load('brand'),
        ]);
    }

    /**
     * Show the form for editing the specified offer.
     */
    public function edit(Offer $offer): Response
    {
        return Inertia::render('Admin/offers/edit', [
            'offer' => $offer,
            'brands' => Brand::query()
                ->where(function ($query) use ($offer) {
                    $query->where('status', Brand::STATUS_ACTIVE)
                        ->orWhere('id', $offer->brand_id);
                })
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified offer.
     */
    public function update(OfferUpdateRequest $request, Offer $offer): RedirectResponse
    {
        $data = $request->validated();
        unset($data['remove_image']);

        if ($request->hasFile('image')) {
            $this->deleteImage($offer);
            $data['image'] = $this->storeImage($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($offer);
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        $offer->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Offer updated.')]);

        return to_route('offers.index');
    }

    /**
     * Remove the specified offer.
     */
    public function destroy(Offer $offer): RedirectResponse
    {
        $this->deleteImage($offer);
        $offer->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Offer deleted.')]);

        return to_route('offers.index');
    }

    /**
     * Store the uploaded image and return its public storage path.
     */
    private function storeImage(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('offers', $filename, 'public');

        return "offers/{$filename}";
    }

    /**
     * Delete the offer's current image file from storage, if any.
     */
    private function deleteImage(Offer $offer): void
    {
        if ($offer->image) {
            Storage::disk('public')->delete($offer->image);
        }
    }
}
