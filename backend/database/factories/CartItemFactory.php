<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartItemFactory extends Factory
{
    public function definition()
    {
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        
        return [
            'user_id' => User::factory(),
            'product_id' => $product->id,
            'quantity' => $this->faker->numberBetween(1, 3),
        ];
    }

    public function forUser($userId)
    {
        return $this->state([
            'user_id' => $userId,
        ]);
    }

    public function forProduct($productId)
    {
        return $this->state([
            'product_id' => $productId,
        ]);
    }
}