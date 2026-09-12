<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Product;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    /**
     * Display the public offers listing, limited to offers active and within date range today.
     */
    public function index(): Response
    {
        $today = Carbon::today();

        $offers = Offer::query()
            ->with('brand')
            ->where('status', Offer::STATUS_ACTIVE)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->orderBy('end_date')
            ->get();

        return Inertia::render('Public/Offers/page', [
            'offers' => $offers,
        ]);
    }

    /**
     * Display a single active offer, alongside featured products from the same brand.
     */
    public function show(Offer $offer): Response
    {
        abort_unless($offer->status === Offer::STATUS_ACTIVE, 404);

        $offer->load('brand');

        $featuredProducts = Product::query()
            ->with(['brand', 'category'])
            ->withCount('coupons')
            ->where('brand_id', $offer->brand_id)
            ->where('status', Product::STATUS_ACTIVE)
            ->where('featured', true)
            ->take(4)
            ->get();

        return Inertia::render('Public/Offers/show', [
            'offer' => $offer,
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
