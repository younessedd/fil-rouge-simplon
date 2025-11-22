<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

// ========================
// 👥 USER MODEL CLASS
// ========================
class User extends Authenticatable
{
    // ========================
    // 🛠️ TRAITS
    // ========================
    use HasApiTokens, HasFactory, Notifiable;

    // ========================
    // 📝 FILLABLE ATTRIBUTES
    // ========================
    protected $fillable = [
        'name',        // User's full name
        'email',       // User's email address (used for login)
        'password',    // Hashed password
        'role',        // User role (e.g., 'user', 'admin')
        'phone',       // User's phone number
        'address',     // User's physical address
        'city'         // User's city
    ];

    // ========================
    // 🙈 HIDDEN ATTRIBUTES
    // ========================
    protected $hidden = [
        'password',        // Never expose password in responses
        'remember_token',  // Security token for "remember me" functionality
    ];

        /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ========================
    // 🔗 ORDERS RELATIONSHIP
    // ========================
    public function orders()
    {
        // A user can have many orders
        return $this->hasMany(Order::class);
    }

    // ========================
    // 🛒 CART ITEMS RELATIONSHIP
    // ========================
    public function cartItems()
    {
        // A user can have many cart items
        return $this->hasMany(CartItem::class);
    }
}