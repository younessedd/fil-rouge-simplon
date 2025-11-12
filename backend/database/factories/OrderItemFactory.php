<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    public function definition()
    {
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        $quantity = $this->faker->numberBetween(1, 5);
        
        return [
            'order_id' => Order::factory(),
            'product_id' => $product->id,
            'quantity' => $quantity,
            'price' => $product->price,
        ];
    }

    public function forOrder($orderId)
    {
        return $this->state([
            'order_id' => $orderId,
        ]);
    }

    public function forProduct($productId)
    {
        $product = Product::find($productId);
        
        return $this->state([
            'product_id' => $productId,
            'price' => $product->price,
        ]);
    }
}