<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    private static $productIndex = 0;
    
    private $productNames = [
        'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro 16"', 'Dell XPS 15',
        'iPad Air', 'Samsung Tablet S9', 'Wireless Headphones', 'Phone Case',
        'USB-C Cable', 'Smart TV 55"', 'Gaming Laptop', 'Digital Camera',
        'Smart Watch', 'Bluetooth Speaker', 'External Hard Drive',
        'Wireless Mouse', 'Mechanical Keyboard', 'Monitor 27"', 'Tablet Stand',
        'Laptop Bag', 'Power Bank', 'Earbuds', 'Webcam', 'Microphone', 'Router'
    ];

    public function definition()
    {
        // استخدام الفهرس لضمان القيم الفريدة
        $name = $this->productNames[self::$productIndex % count($this->productNames)];
        $uniqueSuffix = self::$productIndex > count($this->productNames) ? ' ' . (self::$productIndex + 1) : '';
        
        self::$productIndex++;

        return [
            'name' => $name . $uniqueSuffix,
            'slug' => \Illuminate\Support\Str::slug($name . $uniqueSuffix),
            'description' => $this->faker->paragraph(2),
            'price' => $this->faker->randomFloat(2, 10, 2000),
            'stock' => $this->faker->numberBetween(0, 100),
            'category_id' => Category::factory(),
            'image' => $this->faker->optional(0.3)->passthrough('products/product-' . $this->faker->numberBetween(1, 10) . '.jpg'),
        ];
    }
}