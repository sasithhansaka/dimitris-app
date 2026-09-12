<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GiftCard;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    /**
     * Display the authenticated user's wallet.
     */
    public function index(Request $request): Response
    {
        $today = Carbon::today();

        $giftCards = $request->user()
            ->favoriteGiftCards()
            ->with('brand')
            ->where('gift_cards.status', GiftCard::STATUS_ACTIVE)
            ->orderBy('gift_cards.end_date')
            ->get()
            ->map(fn (GiftCard $giftCard) => [
                ...$giftCard->toArray(),
                'is_expired' => $giftCard->end_date->lt($today),
            ])
            ->values();

        return Inertia::render('Public/wallet/page', [
            'savedGiftCards' => $giftCards,
        ]);
    }
}
