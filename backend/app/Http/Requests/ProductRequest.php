<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// ========================
// 📦 PRODUCT REQUEST CLASS
// ========================
class ProductRequest extends FormRequest
{
    // ========================
    // ✅ AUTHORIZATION CHECK
    // ========================
    public function authorize()
    { 
        return true; // Allow all authenticated users (authorization handled in controller)
    }

    // ========================
    // 📋 VALIDATION RULES
    // ========================
    public function rules()
    {
        // Get product ID from route for unique slug validation
        $id = $this->route('product')?->id;
        
        return [
            // Product name - required field
            'name' => 'required|string|max:255',
            
            // Product slug - must be unique (excluding current product)
            'slug' => "nullable|string|unique:products,slug,$id",
            
            // Product description - optional
            'description' => 'nullable|string',
            
            // Product price - required numeric value
            'price' => 'required|numeric',
            
            // Stock quantity - optional integer
            'stock' => 'nullable|integer',
            
            // Category relationship - must exist in categories table
            'category_id' => 'nullable|exists:categories,id',
            
            // Product image - optional image file with specific requirements
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048'
        ];
    }
}