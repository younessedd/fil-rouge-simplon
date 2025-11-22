<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

// ========================
// 📁 CATEGORY MODEL CLASS
// ========================
class Category extends Model
{
    // ========================
    // 🛠️ TRAITS
    // ========================
    use HasFactory;

    // ========================
    // 📝 FILLABLE ATTRIBUTES
    // ========================
    protected $fillable = [
        'name',    // Category name
        'slug'     // URL-friendly identifier
    ];

    // ========================
    // 🔗 PRODUCTS RELATIONSHIP
    // ========================
    public function products()
    {
        // A category has many products
        return $this->hasMany(Product::class);
    }
}