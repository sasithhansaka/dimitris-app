<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\ArticleCategoryController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

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
});

require __DIR__.'/settings.php';
