<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Welcome page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - redirects cashiers to POS
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // POS routes (accessible by all authenticated users)
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('/pos', [PosController::class, 'store'])->name('pos.store');
    
    // Admin-only routes
    Route::middleware(\App\Http\Middleware\AdminOnly::class)->group(function () {
        // Product management
        Route::resource('products', ProductController::class);
        
        // Category management
        Route::resource('categories', CategoryController::class);
        
        // Inventory management
        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::patch('/inventory/{product}', [InventoryController::class, 'update'])->name('inventory.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';