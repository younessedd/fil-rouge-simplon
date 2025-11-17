<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CartController;

// --------------------------
// Auth
// --------------------------
Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);

// --------------------------
// Public Products
// --------------------------
Route::get('/products', [ProductController::class,'index']);
Route::get('/products/search', [ProductController::class,'search']);
Route::get('/products/{product}', [ProductController::class,'show']);
Route::get('/debug/images', [ProductController::class,'debugImages']);

// عرض الصور
Route::get('/images/products/{filename}', function ($filename) {
    $path = storage_path('app/public/products/' . $filename);
    if (!file_exists($path)) {
        return response()->json(['error' => 'Image not found'], 404);
    }
    return response()->file($path);
})->name('product.image');

// --------------------------
// Protected Routes (admin/auth)
// --------------------------
Route::middleware('auth:sanctum')->group(function() {

    // Auth
    Route::get('/me', [AuthController::class,'me']);
    Route::post('/logout', [AuthController::class,'logout']);

    // Products CRUD (Admin)
    Route::post('/products', [ProductController::class,'store']);           // إنشاء منتج
    //Route::put('/products/{product}', [ProductController::class,'update']); // تحديث منتج
    Route::match(['put', 'patch'], '/products/{product}', [ProductController::class,'update']);
    Route::delete('/products/{product}', [ProductController::class,'destroy']); // حذف منتج

    // Categories CRUD
    Route::apiResource('categories', CategoryController::class);

    // Orders CRUD
    Route::apiResource('orders', OrderController::class)->only(['index','store','show','destroy']);
    Route::get('/admin/orders', [OrderController::class, 'allOrdersForAdmin']); // كل الطلبات للادمن
// بعد الـ routes الموجودة أضف:
Route::get('/admin/dashboard-stats', [AdminController::class, 'getDashboardStats']);
    // Users CRUD
    Route::apiResource('users', UserController::class);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);
    Route::post('/cart/checkout', [CartController::class, 'checkout']);
});
