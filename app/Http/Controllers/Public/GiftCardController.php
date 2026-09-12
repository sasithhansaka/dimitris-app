<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GiftCard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class GiftCardController extends Controller
{
    /**
     * Display the public gift cards listing, limited to gift cards active and within date range today.
     */
    public function index(Request $request): Response
    {
        $today = Carbon::today();

        $giftCards = GiftCard::query()
            ->with('brand')
            ->where('status', GiftCard::STATUS_ACTIVE)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->orderBy('end_date')
            ->get();

        return Inertia::render('Public/GiftCards/page', [
            'giftCards' => $giftCards,
            'favoriteGiftCardIds' => $request->user()
                ?->favoriteGiftCards()
                ->pluck('gift_cards.id')
                ->values() ?? [],
        ]);
    }

    /**
     * Display a single active gift card.
     */
    public function show(Request $request, GiftCard $giftCard): Response
    {
        abort_unless($giftCard->status === GiftCard::STATUS_ACTIVE, 404);

        $giftCard->load('brand');

        $isFavorited = $request->user()
            ?->favoriteGiftCards()
            ->where('gift_cards.id', $giftCard->id)
            ->exists() ?? false;

        return Inertia::render('Public/GiftCards/show', [
            'giftCard' => $giftCard,
            'isFavorited' => $isFavorited,
        ]);
    }

    /**
     * Toggle a gift card as a favorite for the authenticated user.
     */
    public function toggle(Request $request, GiftCard $giftCard): RedirectResponse
    {
        $user = $request->user();

        if ($user->favoriteGiftCards()->where('gift_card_id', $giftCard->id)->exists()) {
            $user->favoriteGiftCards()->detach($giftCard->id);
        } else {
            $user->favoriteGiftCards()->attach($giftCard->id);
        }

        return back();
    }
}
