<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'role:admin,super_admin'])->group(function () {
    Route::inertia('admin/dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
