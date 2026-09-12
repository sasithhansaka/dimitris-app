<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\AccountDetailsUpdateRequest;
use App\Models\Brand;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Display the authenticated user's account page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $categories = ProductCategory::query()
            ->where('status', ProductCategory::STATUS_ACTIVE)
            ->orderBy('display_order')
            ->get(['id', 'name', 'image', 'display_order']);

        $brands = Brand::query()
            ->where('status', Brand::STATUS_ACTIVE)
            ->orderBy('name')
            ->get(['id', 'name', 'logo']);

        $favoriteCategoryIds = $user->favoriteCategories()->pluck('product_categories.id');
        $favoriteBrandIds = $user->favoriteBrands()->pluck('brands.id');

        return Inertia::render('Public/account/page', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'country' => $user->country,
                'city' => $user->city,
                'address' => $user->address,
                'phone_number' => $user->phone_number,
                'dob' => $user->dob?->toDateString(),
                'created_at' => $user->created_at,
            ],
            'favoriteCategoryCount' => $favoriteCategoryIds->count(),
            'favoriteBrandCount' => $favoriteBrandIds->count(),
            'categories' => $categories,
            'brands' => $brands,
            'favoriteCategoryIds' => $favoriteCategoryIds->values(),
            'favoriteBrandIds' => $favoriteBrandIds->values(),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the authenticated user's account details.
     */
    public function updateDetails(AccountDetailsUpdateRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());

        return back();
    }

    /**
     * Toggle a product category as a favorite for the authenticated user.
     */
    public function toggleCategory(Request $request, ProductCategory $category): RedirectResponse
    {
        $user = $request->user();

        if ($user->favoriteCategories()->where('category_id', $category->id)->exists()) {
            $user->favoriteCategories()->detach($category->id);
        } else {
            $user->favoriteCategories()->attach($category->id);
        }

        return back();
    }

    /**
     * Toggle a brand as a favorite for the authenticated user.
     */
    public function toggleBrand(Request $request, Brand $brand): RedirectResponse
    {
        $user = $request->user();

        if ($user->favoriteBrands()->where('brand_id', $brand->id)->exists()) {
            $user->favoriteBrands()->detach($brand->id);
        } else {
            $user->favoriteBrands()->attach($brand->id);
        }

        return back();
    }
}
