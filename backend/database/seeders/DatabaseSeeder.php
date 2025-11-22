<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Support\Facades\Hash;

// ========================
// 🌱 DATABASE SEEDER CLASS
// ========================
class DatabaseSeeder extends Seeder
{
    // ========================
    // 🚀 MAIN SEED METHOD
    // ========================
    public function run()
    {
        // ========================
        // 👑 CREATE ADMIN USER
        // ========================
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'phone' => '+1-555-0101',
            'address' => '123 Admin Street, Downtown',
            'city' => 'New York',
        ]);

        // ========================
        // 👥 CREATE REGULAR USERS
        // ========================
        $users = User::factory(5)->create();

        // ========================
        // 📁 CREATE CATEGORIES
        // ========================
        $categories = Category::factory(5)->create();

        // ========================
        // 📦 CREATE PRODUCTS FOR EACH CATEGORY
        // ========================
        $categories->each(function($category) {
            // Create 5 products for each category
            Product::factory(5)->create([
                'category_id' => $category->id
            ]);
        });

        // ========================
        // 🛒 CREATE ORDERS FOR EACH USER
        // ========================
        foreach ($users as $user) {
            // Create order with initial total of 0
            $order = Order::create([
                'user_id' => $user->id,
                'total' => 0
            ]);

            // Get 3 random products for this order
            $products = Product::inRandomOrder()->take(3)->get();
            $total = 0;

            // Create order items and calculate total
            foreach ($products as $product) {
                $quantity = rand(1, 3);
                $total += $product->price * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ]);
            }

            // Update order with calculated total
            $order->update(['total' => $total]);

            // ========================
            // 🛍️ ADD ITEMS TO USER'S CART
            // ========================
            CartItem::factory(2)->create([
                'user_id' => $user->id,
            ]);
        }

        // ========================
        // 📊 SEEDING COMPLETION MESSAGE
        // ========================
        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('👑 Admin User: admin@example.com / password');
        $this->command->info('👥 5 regular users created');
        $this->command->info('📁 5 categories created');
        $this->command->info('🛍️ 25 products created');
        $this->command->info('📦 5 orders created');
        $this->command->info('🛒 10 cart items created');
    }
}