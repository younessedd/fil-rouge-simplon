<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'total' => $this->faker->randomFloat(2, 50, 1000),
        ];
    }

    public function withUser($userId)
    {
        return $this->state([
            'user_id' => $userId,
        ]);
    }
}