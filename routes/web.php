<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'role:admin,super_admin'])->group(function () {
    Route::inertia('admin/dashboard', 'Admin/dashboard/dashboard')->name('dashboard');

    Route::get('admin/users', [UserController::class, 'index'])->name('users.index');
    Route::get('admin/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::delete('admin/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('admin/logs', [ActivityLogController::class, 'index'])->name('logs.index');
});

require __DIR__.'/settings.php';
