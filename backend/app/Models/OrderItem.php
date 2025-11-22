<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ========================
// 📦 ORDER ITEM MODEL CLASS
// ========================
class OrderItem extends Model
{
    // ========================
    // 🛠️ TRAITS
    // ========================
    use HasFactory;

    // ========================
    // 📝 FILLABLE ATTRIBUTES
    // ========================
    protected $fillable = [
        'order_id',     // Foreign key to orders table
        'product_id',   // Foreign key to products table
        'quantity',     // Quantity of product ordered
        'price'         // Price at time of order (snapshot)
    ];

    // ========================
    // 🔗 ORDER RELATIONSHIP
    // ========================
    public function order()
    {
        // An order item belongs to one order
        return $this->belongsTo(Order::class);
    }

    // ========================
    // 🔗 PRODUCT RELATIONSHIP
    // ========================
    public function product()
    {
        // An order item belongs to one product
        return $this->belongsTo(Product::class);
    }
}