<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\AdminController;
use Illuminate\Http\Request;

// ========================
// 🔐 AUTHENTICATION ROUTES
// ========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ========================
// 📦 PUBLIC PRODUCT ROUTES
// ========================
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// ========================
// 📤 FILE UPLOAD ROUTES - 🔥 التصحيح هنا
// ========================
// تأكد من هذا الجزء في ملف routes/api.php
Route::post('/upload/image', function (Request $request) {
    $request->validate([
        'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048'
    ]);

    $path = $request->file('image')->store('products', 'public');

    return response()->json([
        'success' => true,
        'path' => $path,
        'filename' => basename($path),
        'url' => asset('storage/' . $path) // 🔥 التصحيح هنا
    ]);
});

Route::post('/upload/multiple', function (Request $request) {
    $request->validate([
        'images.*' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048'
    ]);

    $uploadedFiles = [];
    foreach ($request->file('images') as $file) {
        $path = $file->store('products', 'public');
        $uploadedFiles[] = [
            'path' => $path,
            'filename' => basename($path),
            'url' => asset('storage/' . $path) // 🔥 التصحيح هنا أيضاً
        ];
    }

    return response()->json([
        'success' => true,
        'files' => $uploadedFiles
    ]);
});

// ========================
// 🔒 PROTECTED ROUTES
// ========================
Route::middleware('auth:sanctum')->group(function() {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']); 
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin only routes
    Route::post('/products', [ProductController::class, 'store']);
    Route::match(['put', 'patch'], '/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('orders', OrderController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::get('/admin/orders', [OrderController::class, 'allOrdersForAdmin']);
    Route::get('/admin/dashboard-stats', [AdminController::class, 'getDashboardStats']);
    Route::apiResource('users', UserController::class);

    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);
    Route::post('/cart/checkout', [CartController::class, 'checkout']);
});