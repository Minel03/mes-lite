<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductionLogController;
use App\Http\Controllers\ProductionOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('machines', MachineController::class);
    Route::resource('production-orders', ProductionOrderController::class);
    Route::resource('production-logs', ProductionLogController::class);
    Route::resource('products', ProductController::class);
    Route::resource('inventory', InventoryController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
