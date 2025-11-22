<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ========================
// 📋 ORDER MODEL CLASS
// ========================
class Order extends Model
{
    // ========================
    // 🛠️ TRAITS
    // ========================
    use HasFactory;

    // ========================
    // 📝 FILLABLE ATTRIBUTES
    // ========================
    protected $fillable = [
        'user_id',    // Foreign key to users table
        'total'       // Total amount of the order
    ];

    // ========================
    // 🔗 USER RELATIONSHIP
    // ========================
    public function user()
    {
        // An order belongs to one user
        return $this->belongsTo(User::class);
    }

    // ========================
    // 🔗 ORDER ITEMS RELATIONSHIP
    // ========================
    public function items()
    {
        // An order has many order items
        return $this->hasMany(OrderItem::class);
    }
}