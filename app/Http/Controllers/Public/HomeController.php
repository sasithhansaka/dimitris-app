<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GiftCard;
use App\Models\Offer;
use App\Models\Product;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public home page.
     */
    public function index(): Response
    {
        $featuredProducts = Product::query()
            ->with(['brand', 'category'])
            ->withCount('coupons')
            ->where('status', Product::STATUS_ACTIVE)
            ->where('featured', true)
            ->get()
            ->shuffle()
            ->take(4)
            ->values();

        $today = Carbon::today();

        $featuredOffers = Offer::query()
            ->with('brand')
            ->where('status', Offer::STATUS_ACTIVE)
            ->where('featured', true)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->get()
            ->shuffle()
            ->take(3)
            ->values();

        $featuredGiftCards = GiftCard::query()
            ->with('brand')
            ->where('status', GiftCard::STATUS_ACTIVE)
            ->where('featured', true)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->get()
            ->shuffle()
            ->take(4)
            ->values();

        return Inertia::render('Public/home', [
            'featuredProducts' => $featuredProducts,
            'featuredOffers' => $featuredOffers,
            'featuredGiftCards' => $featuredGiftCards,
        ]);
    }
}
