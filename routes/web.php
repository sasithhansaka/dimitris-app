<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\ArticleCategoryController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Public\ArticleController as PublicArticleController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Public/home')->name('home');
Route::get('articles', [PublicArticleController::class, 'index'])->name('public.articles');

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
});

require __DIR__.'/settings.php';
