<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\ArticleCategoryController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DistributorController;
use App\Http\Controllers\Admin\FaqCategoryController;
use App\Http\Controllers\Admin\GiftCardController;
use App\Http\Controllers\Admin\OfferController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RetailerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Public\ArticleController as PublicArticleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['coming.soon'])->group(function () {
    Route::inertia('/', 'Public/home')->name('home');
    Route::get('articles', [PublicArticleController::class, 'index'])->name('public.articles');
    Route::get('articles/{article:slug}', [PublicArticleController::class, 'show'])->name('public.articles.show');
    Route::inertia('competitions', 'Public/Competitions/page')->name('public.competitions');
    Route::inertia('offers', 'Public/Offers/page')->name('public.offers');
    Route::inertia('gift-cards', 'Public/GiftCards/page')->name('public.gift-cards');
    Route::inertia('coupons', 'Public/Coupons/page')->name('public.coupons');
    Route::inertia('products', 'Public/products/page')->name('public.products');
    Route::inertia('account', 'Public/account/page')->name('public.account');
    Route::inertia('wallet', 'Public/wallet/page')->name('public.wallet');
    Route::inertia('notifications', 'Public/notifications/page')->name('public.notifications');
});

Route::middleware(['auth', 'verified', 'role:admin,super_admin'])->group(function () {
    Route::inertia('admin/dashboard', 'Admin/dashboard/dashboard')->name('dashboard');

    Route::get('admin/users', [UserController::class, 'index'])->name('users.index');
    Route::get('admin/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::delete('admin/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('admin/logs', [ActivityLogController::class, 'index'])->name('logs.index');

    Route::get('admin/articles-category', [ArticleCategoryController::class, 'index'])->name('article-categories.index');
    Route::get('admin/articles-category/create', [ArticleCategoryController::class, 'create'])->name('article-categories.create');
    Route::post('admin/articles-category', [ArticleCategoryController::class, 'store'])->name('article-categories.store');
    Route::get('admin/articles-category/{articleCategory}/edit', [ArticleCategoryController::class, 'edit'])->name('article-categories.edit');
    Route::put('admin/articles-category/{articleCategory}', [ArticleCategoryController::class, 'update'])->name('article-categories.update');
    Route::delete('admin/articles-category/{articleCategory}', [ArticleCategoryController::class, 'destroy'])->name('article-categories.destroy');

    Route::get('admin/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('admin/articles/create', [ArticleController::class, 'create'])->name('articles.create');
    Route::post('admin/articles', [ArticleController::class, 'store'])->name('articles.store');
    Route::get('admin/articles/{article}/edit', [ArticleController::class, 'edit'])->name('articles.edit');
    Route::put('admin/articles/{article}', [ArticleController::class, 'update'])->name('articles.update');
    Route::delete('admin/articles/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy');

    Route::get('admin/distributors', [DistributorController::class, 'index'])->name('distributors.index');
    Route::get('admin/distributors/create', [DistributorController::class, 'create'])->name('distributors.create');
    Route::post('admin/distributors', [DistributorController::class, 'store'])->name('distributors.store');
    Route::get('admin/distributors/{distributor}', [DistributorController::class, 'show'])->name('distributors.show');
    Route::get('admin/distributors/{distributor}/edit', [DistributorController::class, 'edit'])->name('distributors.edit');
    Route::put('admin/distributors/{distributor}', [DistributorController::class, 'update'])->name('distributors.update');
    Route::delete('admin/distributors/{distributor}', [DistributorController::class, 'destroy'])->name('distributors.destroy');

    Route::get('admin/brands', [BrandController::class, 'index'])->name('brands.index');
    Route::get('admin/brands/create', [BrandController::class, 'create'])->name('brands.create');
    Route::post('admin/brands', [BrandController::class, 'store'])->name('brands.store');
    Route::get('admin/brands/{brand}', [BrandController::class, 'show'])->name('brands.show');
    Route::get('admin/brands/{brand}/edit', [BrandController::class, 'edit'])->name('brands.edit');
    Route::put('admin/brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
    Route::delete('admin/brands/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');

    Route::get('admin/offers', [OfferController::class, 'index'])->name('offers.index');
    Route::get('admin/offers/create', [OfferController::class, 'create'])->name('offers.create');
    Route::post('admin/offers', [OfferController::class, 'store'])->name('offers.store');
    Route::get('admin/offers/{offer}', [OfferController::class, 'show'])->name('offers.show');
    Route::get('admin/offers/{offer}/edit', [OfferController::class, 'edit'])->name('offers.edit');
    Route::put('admin/offers/{offer}', [OfferController::class, 'update'])->name('offers.update');
    Route::delete('admin/offers/{offer}', [OfferController::class, 'destroy'])->name('offers.destroy');

    Route::get('admin/gift-cards', [GiftCardController::class, 'index'])->name('gift-cards.index');
    Route::get('admin/gift-cards/create', [GiftCardController::class, 'create'])->name('gift-cards.create');
    Route::post('admin/gift-cards', [GiftCardController::class, 'store'])->name('gift-cards.store');
    Route::get('admin/gift-cards/{giftCard}', [GiftCardController::class, 'show'])->name('gift-cards.show');
    Route::get('admin/gift-cards/{giftCard}/edit', [GiftCardController::class, 'edit'])->name('gift-cards.edit');
    Route::put('admin/gift-cards/{giftCard}', [GiftCardController::class, 'update'])->name('gift-cards.update');
    Route::delete('admin/gift-cards/{giftCard}', [GiftCardController::class, 'destroy'])->name('gift-cards.destroy');

    Route::get('admin/coupons', [CouponController::class, 'index'])->name('coupons.index');
    Route::get('admin/coupons/create', [CouponController::class, 'create'])->name('coupons.create');
    Route::post('admin/coupons', [CouponController::class, 'store'])->name('coupons.store');
    Route::get('admin/coupons/{coupon}', [CouponController::class, 'show'])->name('coupons.show');
    Route::get('admin/coupons/{coupon}/edit', [CouponController::class, 'edit'])->name('coupons.edit');
    Route::put('admin/coupons/{coupon}', [CouponController::class, 'update'])->name('coupons.update');
    Route::delete('admin/coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');

    Route::get('admin/product-categories', [ProductCategoryController::class, 'index'])->name('product-categories.index');
    Route::get('admin/product-categories/create', [ProductCategoryController::class, 'create'])->name('product-categories.create');
    Route::post('admin/product-categories', [ProductCategoryController::class, 'store'])->name('product-categories.store');
    Route::get('admin/product-categories/{productCategory}', [ProductCategoryController::class, 'show'])->name('product-categories.show');
    Route::get('admin/product-categories/{productCategory}/edit', [ProductCategoryController::class, 'edit'])->name('product-categories.edit');
    Route::put('admin/product-categories/{productCategory}', [ProductCategoryController::class, 'update'])->name('product-categories.update');
    Route::delete('admin/product-categories/{productCategory}', [ProductCategoryController::class, 'destroy'])->name('product-categories.destroy');

    Route::get('admin/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('admin/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('admin/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('admin/products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::get('admin/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('admin/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('admin/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('admin/retailers', [RetailerController::class, 'index'])->name('retailers.index');
    Route::get('admin/retailers/create', [RetailerController::class, 'create'])->name('retailers.create');
    Route::post('admin/retailers', [RetailerController::class, 'store'])->name('retailers.store');
    Route::get('admin/retailers/{retailer}', [RetailerController::class, 'show'])->name('retailers.show');
    Route::get('admin/retailers/{retailer}/edit', [RetailerController::class, 'edit'])->name('retailers.edit');
    Route::put('admin/retailers/{retailer}', [RetailerController::class, 'update'])->name('retailers.update');
    Route::delete('admin/retailers/{retailer}', [RetailerController::class, 'destroy'])->name('retailers.destroy');

    Route::get('admin/faq-categories', [FaqCategoryController::class, 'index'])->name('faq-categories.index');
    Route::get('admin/faq-categories/create', [FaqCategoryController::class, 'create'])->name('faq-categories.create');
    Route::post('admin/faq-categories', [FaqCategoryController::class, 'store'])->name('faq-categories.store');
    Route::get('admin/faq-categories/{faqCategory}/edit', [FaqCategoryController::class, 'edit'])->name('faq-categories.edit');
    Route::put('admin/faq-categories/{faqCategory}', [FaqCategoryController::class, 'update'])->name('faq-categories.update');
    Route::delete('admin/faq-categories/{faqCategory}', [FaqCategoryController::class, 'destroy'])->name('faq-categories.destroy');
});

require __DIR__.'/settings.php';
