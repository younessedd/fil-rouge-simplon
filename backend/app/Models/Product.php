<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

// ========================
// 📦 PRODUCT MODEL CLASS
// ========================
class Product extends Model
{
    // ========================
    // 🛠️ TRAITS
    // ========================
    use HasFactory;

    // ========================
    // 📝 FILLABLE ATTRIBUTES
    // ========================
    protected $fillable = [
        'name',          // Product name
        'slug',          // URL-friendly identifier
        'description',   // Product description
        'price',         // Product price
        'stock',         // Inventory quantity
        'category_id',   // Foreign key to categories table
        'image'          // Product image path
    ];
    
    // ========================
    // 🔗 CATEGORY RELATIONSHIP
    // ========================
    public function category()
    {
        // A product belongs to one category
        return $this->belongsTo(Category::class);
    }

    // ========================
    // 🛒 CART ITEMS RELATIONSHIP
    // ========================
    public function cartItems()
    {
        // A product can be in many cart items
        return $this->hasMany(CartItem::class);
    }

    // ========================
    // 📦 ORDER ITEMS RELATIONSHIP
    // ========================
    public function orderItems()
    {
        // A product can be in many order items
        return $this->hasMany(OrderItem::class);
    }

    // ========================
    // 🌐 IMAGE URL ACCESSOR
    // ========================
    public function getImageUrlAttribute()
    {
        // Return placeholder if no image exists
        if (!$this->image) {
            return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
        }
        
        // Generate full URL to the product image
        $baseUrl = config('app.url', 'http://localhost:8000');
        return $baseUrl . '/storage/' . ltrim($this->image, '/');
    }
}