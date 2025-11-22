<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

// ========================
// 📦 ORDER ITEM FACTORY CLASS
// ========================
class OrderItemFactory extends Factory
{
    // ========================
    // 📝 FACTORY DEFINITION
    // ========================
    public function definition()
    {
        // Get random existing product or create new one if none exists
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        
        // Random quantity between 1 and 5
        $quantity = $this->faker->numberBetween(1, 5);
        
        return [
            // Create a new order or use existing one
            'order_id' => Order::factory(),
            
            // Use the product ID (existing or newly created)
            'product_id' => $product->id,
            
            // Random quantity for the order item
            'quantity' => $quantity,
            
            // Use the current product price (price snapshot)
            'price' => $product->price,
        ];
    }

    // ========================
    // 📋 CUSTOM STATE: FOR SPECIFIC ORDER
    // ========================
    public function forOrder($orderId)
    {
        return $this->state([
            'order_id' => $orderId,  // Assign to specific order
        ]);
    }

    // ========================
    // 📦 CUSTOM STATE: FOR SPECIFIC PRODUCT
    // ========================
    public function forProduct($productId)
    {
        // Get the product to use its current price
        $product = Product::find($productId);
        
        return $this->state([
            'product_id' => $productId,  // Assign to specific product
            'price' => $product->price,  // Use the product's current price
        ]);
    }
}