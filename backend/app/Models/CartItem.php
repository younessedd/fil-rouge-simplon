<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ========================
// 🛒 CART ITEM MODEL CLASS
// ========================
class CartItem extends Model
{
    // ========================
    // 🛠️ TRAITS
    // ========================
    use HasFactory;

    // ========================
    // 📝 FILLABLE ATTRIBUTES
    // ========================
    protected $fillable = [
        'user_id',      // Foreign key to users table
        'product_id',   // Foreign key to products table
        'quantity'      // Number of items in cart
    ];

    // ========================
    // 🔗 PRODUCT RELATIONSHIP
    // ========================
    public function product()
    {
        // A cart item belongs to one product
        return $this->belongsTo(Product::class);
    }

    // ========================
    // 🔗 USER RELATIONSHIP
    // ========================
    public function user()
    {
        // A cart item belongs to one user
        return $this->belongsTo(User::class);
    }
}