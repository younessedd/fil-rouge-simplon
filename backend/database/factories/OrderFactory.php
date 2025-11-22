<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

// ========================
// 📋 ORDER FACTORY CLASS
// ========================
class OrderFactory extends Factory
{
    // ========================
    // 📝 FACTORY DEFINITION
    // ========================
    public function definition()
    {
        return [
            // Create a new user or use existing one
            'user_id' => User::factory(),
            
            // Random order total between 50 and 1000 with 2 decimal places
            'total' => $this->faker->randomFloat(2, 50, 1000),
        ];
    }

    // ========================
    // 👤 CUSTOM STATE: FOR SPECIFIC USER
    // ========================
    public function withUser($userId)
    {
        return $this->state([
            'user_id' => $userId,  // Assign to specific user
        ]);
    }
}