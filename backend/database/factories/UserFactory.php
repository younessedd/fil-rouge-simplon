<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

// ========================
// 👥 USER FACTORY CLASS
// ========================
class UserFactory extends Factory
{
    // ========================
    // 📝 FACTORY DEFINITION
    // ========================
    public function definition()
    {
        return [
            // Random full name
            'name' => $this->faker->name(),
            
            // Unique email address
            'email' => $this->faker->unique()->safeEmail(),
            
            // Default password (hashed)
            'password' => Hash::make('password'),
            
            // Default role for new users
            'role' => 'user',
            
            // Random phone number
            'phone' => $this->faker->phoneNumber(),
            
            // Random address
            'address' => $this->faker->address(),
            
            // Random city
            'city' => $this->faker->city(),
        ];
    }

    // ========================
    // 👑 CUSTOM STATE: ADMIN USER
    // ========================
    public function admin()
    {
        return $this->state([
            // Admin role with elevated privileges
            'role' => 'admin',
            
            // Fixed admin name for easy identification
            'name' => 'Admin User',
            
            // Standard admin email
            'email' => 'admin@example.com',
            
            // Professional phone number
            'phone' => '+1-555-0100',
            
            // Business address
            'address' => '123 Admin Street, Downtown',
            
            // Major city
            'city' => 'New York',
        ]);
    }
}