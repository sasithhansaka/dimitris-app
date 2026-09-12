<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display the public products listing, filterable by search, brand and category.
     */
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with(['brand', 'category'])
            ->withCount('coupons')
            ->where('status', Product::STATUS_ACTIVE);

        if ($search = $request->string('q')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('receipt_aliases', 'like', "%{$search}%");
            });
        }

        if ($brandId = $request->integer('brand')) {
            $query->where('brand_id', $brandId);
        }

        if ($categoryId = $request->integer('category')) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->orderBy('name')->get();

        $brands = Brand::query()
            ->where('status', Brand::STATUS_ACTIVE)
            ->orderBy('name')
            ->get(['id', 'name', 'logo']);

        $categories = ProductCategory::query()
            ->where('status', ProductCategory::STATUS_ACTIVE)
            ->orderBy('display_order')
            ->get(['id', 'name']);

        return Inertia::render('Public/products/page', [
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories,
            'filters' => $request->only(['q', 'brand', 'category']),
        ]);
    }
}
