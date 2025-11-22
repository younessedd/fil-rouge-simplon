<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace Database\Factories;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

// ========================
// 🛒 CART ITEM FACTORY CLASS
// ========================
class CartItemFactory extends Factory
{
    // ========================
    // 📝 FACTORY DEFINITION
    // ========================
    public function definition()
    {
        // Get random existing product or create new one if none exists
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        
        return [
            // Create a new user or use existing one
            'user_id' => User::factory(),
            
            // Use the product ID (existing or newly created)
            'product_id' => $product->id,
            
            // Random quantity between 1 and 3
            'quantity' => $this->faker->numberBetween(1, 3),
        ];
    }

    // ========================
    // 👤 CUSTOM STATE: FOR SPECIFIC USER
    // ========================
    public function forUser($userId)
    {
        return $this->state([
            'user_id' => $userId,  // Assign to specific user
        ]);
    }

    // ========================
    // 📦 CUSTOM STATE: FOR SPECIFIC PRODUCT
    // ========================
    public function forProduct($productId)
    {
        return $this->state([
            'product_id' => $productId,  // Assign to specific product
        ]);
    }
}