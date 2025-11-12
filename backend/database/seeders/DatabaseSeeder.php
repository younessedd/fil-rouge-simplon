<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // إنشاء Admin واحد مع البيانات الجديدة
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'phone' => '+1-555-0101',
            'address' => '123 Admin Street, Downtown',
            'city' => 'New York',
        ]);

        // إنشاء 5 مستخدمين عاديين
        $users = User::factory(5)->create();

        // إنشاء 5 فئات
        $categories = Category::factory(5)->create();

        // لكل فئة، إنشاء 5 منتجات
        $categories->each(function($category) {
            Product::factory(5)->create([
                'category_id' => $category->id
            ]);
        });

        // إنشاء طلب لكل مستخدم مع عناصر عشوائية
        foreach ($users as $user) {
            $order = Order::create([
                'user_id' => $user->id,
                'total' => 0
            ]);

            $products = Product::inRandomOrder()->take(3)->get();
            $total = 0;

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

            $order->update(['total' => $total]);

            // إضافة بعض العناصر إلى سلة المستخدم
            CartItem::factory(2)->create([
                'user_id' => $user->id,
            ]);
        }

        // رسالة تأكيد
        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('👑 Admin User: admin@example.com / password');
        $this->command->info('👥 5 regular users created');
        $this->command->info('📁 5 categories created');
        $this->command->info('🛍️ 25 products created');
        $this->command->info('📦 5 orders created');
        $this->command->info('🛒 10 cart items created');
    }
}