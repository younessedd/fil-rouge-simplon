<?php

// ========================
// 🗂️ ROUTE IMPORTS
// ========================
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\AdminController;

// ========================
// 🔐 AUTHENTICATION ROUTES (Public)
// ========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ========================
// 📦 PUBLIC PRODUCT ROUTES
// ========================
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/debug/images', [ProductController::class, 'debugImages']);

// ========================
// 🖼️ PRODUCT IMAGES ROUTE
// ========================
Route::get('/images/products/{filename}', function ($filename) {
    $path = storage_path('app/public/products/' . $filename);
    if (!file_exists($path)) {
        return response()->json(['error' => 'Image not found'], 404);
    }
    return response()->file($path);
})->name('product.image');

// ========================
// 🔒 PROTECTED ROUTES (Require Authentication)
// ========================
Route::middleware('auth:sanctum')->group(function() {

    // ========================
    // 👤 AUTHENTICATION ROUTES
    // ========================
    Route::get('/me', [AuthController::class, 'me']);
     Route::put('/profile', [AuthController::class, 'updateProfile']); 
    Route::post('/logout', [AuthController::class, 'logout']);

    // ========================
    // 📦 PRODUCT MANAGEMENT ROUTES (Admin Only)
    // ========================
    Route::post('/products', [ProductController::class, 'store']);           // Create product
    Route::match(['put', 'patch'], '/products/{product}', [ProductController::class, 'update']); // Update product
    Route::delete('/products/{product}', [ProductController::class, 'destroy']); // Delete product

    // ========================
    // 📁 CATEGORY MANAGEMENT ROUTES (Admin Only)
    // ========================
    Route::apiResource('categories', CategoryController::class);

    // ========================
    // 🛒 ORDER MANAGEMENT ROUTES
    // ========================
    Route::apiResource('orders', OrderController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::get('/admin/orders', [OrderController::class, 'allOrdersForAdmin']); // All orders for admin

    // ========================
    // 📊 ADMIN DASHBOARD ROUTES
    // ========================
    Route::get('/admin/dashboard-stats', [AdminController::class, 'getDashboardStats']);

    // ========================
    // 👥 USER MANAGEMENT ROUTES (Admin Only)
    // ========================
    Route::apiResource('users', UserController::class);

    // ========================
    // 🛍️ SHOPPING CART ROUTES
    // ========================
    Route::get('/cart', [CartController::class, 'index']);           // View cart
    Route::post('/cart', [CartController::class, 'add']);            // Add to cart
    Route::delete('/cart/{id}', [CartController::class, 'destroy']); // Remove from cart
    Route::delete('/cart', [CartController::class, 'clear']);        // Clear entire cart
    Route::post('/cart/checkout', [CartController::class, 'checkout']); // Checkout
});