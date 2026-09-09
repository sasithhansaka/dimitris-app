<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GiftCardStoreRequest;
use App\Http\Requests\Admin\GiftCardUpdateRequest;
use App\Models\Brand;
use App\Models\GiftCard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GiftCardController extends Controller
{
    /**
     * Display a paginated, searchable listing of gift cards.
     */
    public function index(Request $request): Response
    {
        $query = GiftCard::query()->with('brand');

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('gift_code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [GiftCard::STATUS_ACTIVE, GiftCard::STATUS_INACTIVE, GiftCard::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $giftCards = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/giftCards/index', [
            'giftCards' => $giftCards,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new gift card.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/giftCards/create', [
            'brands' => Brand::query()
                ->where('status', Brand::STATUS_ACTIVE)
                ->orderBy('name')
                ->get(['id', 'name']),
            'nextGiftCode' => GiftCard::nextGiftCode(),
        ]);
    }

    /**
     * Store a newly created gift card.
     */
    public function store(GiftCardStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'));
        }

        GiftCard::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Gift card created.')]);

        return to_route('gift-cards.index');
    }

    /**
     * Display the specified gift card.
     */
    public function show(GiftCard $giftCard): Response
    {
        return Inertia::render('Admin/giftCards/show', [
            'giftCard' => $giftCard->load('brand'),
        ]);
    }

    /**
     * Show the form for editing the specified gift card.
     */
    public function edit(GiftCard $giftCard): Response
    {
        return Inertia::render('Admin/giftCards/edit', [
            'giftCard' => $giftCard,
            'brands' => Brand::query()
                ->where(function ($query) use ($giftCard) {
                    $query->where('status', Brand::STATUS_ACTIVE)
                        ->orWhere('id', $giftCard->brand_id);
                })
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified gift card.
     */
    public function update(GiftCardUpdateRequest $request, GiftCard $giftCard): RedirectResponse
    {
        $data = $request->validated();
        unset($data['remove_image']);

        if ($request->hasFile('image')) {
            $this->deleteImage($giftCard);
            $data['image'] = $this->storeImage($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($giftCard);
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        $giftCard->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Gift card updated.')]);

        return to_route('gift-cards.index');
    }

    /**
     * Remove the specified gift card.
     */
    public function destroy(GiftCard $giftCard): RedirectResponse
    {
        $this->deleteImage($giftCard);
        $giftCard->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Gift card deleted.')]);

        return to_route('gift-cards.index');
    }

    /**
     * Store the uploaded image and return its public storage path.
     */
    private function storeImage(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('gift-cards', $filename, 'public');

        return "gift-cards/{$filename}";
    }

    /**
     * Delete the gift card's current image file from storage, if any.
     */
    private function deleteImage(GiftCard $giftCard): void
    {
        if ($giftCard->image) {
            Storage::disk('public')->delete($giftCard->image);
        }
    }
}
