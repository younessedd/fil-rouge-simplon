<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class RolesAndUsersSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name'=>'Admin User',
            'email'=>'admin@example.com',
            'password'=>Hash::make('password'),
            'role'=>'admin'
        ]);

        User::create([
            'name'=>'Normal User',
            'email'=>'user@example.com',
            'password'=>Hash::make('password'),
            'role'=>'user'
        ]);

        $c = Category::create(['name'=>'Electronics','slug'=>'electronics']);
        Product::create([
            'name'=>'Sample Phone',
            'slug'=>'sample-phone',
            'description'=>'A sample phone for demo',
            'price'=>199.99,
            'stock'=>10,
            'category_id'=>$c->id
        ]);
        
        $c2 = Category::create(['name'=>'Books','slug'=>'books']);
        Product::create([
            'name'=>'Learn Laravel',
            'slug'=>'learn-laravel',
            'description'=>'Book about Laravel',
            'price'=>29.99,
            'stock'=>50,
            'category_id'=>$c2->id
        ]);
    }
}
