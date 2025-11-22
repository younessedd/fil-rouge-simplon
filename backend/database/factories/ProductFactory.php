<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

// ========================
// 📦 PRODUCT FACTORY CLASS
// ========================
class ProductFactory extends Factory
{
    // ========================
    // 🔢 STATIC COUNTER
    // ========================
    private static $productIndex = 0;
    
    // ========================
    // 📋 PREDEFINED PRODUCT NAMES
    // ========================
    private $productNames = [
        'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro 16"', 'Dell XPS 15',
        'iPad Air', 'Samsung Tablet S9', 'Wireless Headphones', 'Phone Case',
        'USB-C Cable', 'Smart TV 55"', 'Gaming Laptop', 'Digital Camera',
        'Smart Watch', 'Bluetooth Speaker', 'External Hard Drive',
        'Wireless Mouse', 'Mechanical Keyboard', 'Monitor 27"', 'Tablet Stand',
        'Laptop Bag', 'Power Bank', 'Earbuds', 'Webcam', 'Microphone', 'Router'
    ];

    // ========================
    // 📝 FACTORY DEFINITION
    // ========================
    public function definition()
    {
        // Use index to ensure unique values
        $name = $this->productNames[self::$productIndex % count($this->productNames)];
        $uniqueSuffix = self::$productIndex > count($this->productNames) ? ' ' . (self::$productIndex + 1) : '';
        
        // Increment counter for next product
        self::$productIndex++;

        return [
            // Product name with unique suffix if needed
            'name' => $name . $uniqueSuffix,
            
            // URL-friendly slug generated from name
            'slug' => \Illuminate\Support\Str::slug($name . $uniqueSuffix),
            
            // Random product description (2 paragraphs)
            'description' => $this->faker->paragraph(2),
            
            // Random price between 10 and 2000 with 2 decimal places
            'price' => $this->faker->randomFloat(2, 10, 2000),
            
            // Random stock quantity between 0 and 100
            'stock' => $this->faker->numberBetween(0, 100),
            
            // Create a new category or use existing one
            'category_id' => Category::factory(),
            
            // Optional product image (30% chance of having an image)
            'image' => $this->faker->optional(0.3)->passthrough('products/product-' . $this->faker->numberBetween(1, 10) . '.jpg'),
        ];
    }
}