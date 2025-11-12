<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
        ];
    }

    public function admin()
    {
        return $this->state([
            'role' => 'admin',
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'phone' => '+1-555-0100',
            'address' => '123 Admin Street, Downtown',
            'city' => 'New York',
        ]);
    }
}