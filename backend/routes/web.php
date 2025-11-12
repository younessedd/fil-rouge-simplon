<?php

use Illuminate\Support\Facades\Route;

// routes للصور في web.php لضمان عملها
Route::get('/storage/products/{filename}', function ($filename) {
    $path = storage_path('app/public/products/' . $filename);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    return response()->file($path);
});

// route بديل للصور
Route::get('/product-images/{filename}', function ($filename) {
    $path = storage_path('app/public/products/' . $filename);
    
    if (!file_exists($path)) {
        return response()->file(public_path('images/placeholder.jpg'));
    }
    
    $file = file_get_contents($path);
    $type = mime_content_type($path);
    
    return response($file, 200)->header('Content-Type', $type);
});