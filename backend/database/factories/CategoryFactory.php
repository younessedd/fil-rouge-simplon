<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

// ========================
// 📁 CATEGORY FACTORY CLASS
// ========================
class CategoryFactory extends Factory
{
    // ========================
    // 🔢 STATIC COUNTER
    // ========================
    private static $categoryIndex = 0;
    
    // ========================
    // 📋 PREDEFINED CATEGORIES
    // ========================
    private $categories = [
        'Electronics', 
        'Mobile Phones', 
        'Laptops', 
        'Tablets', 
        'Accessories',
        'Home Appliances', 
        'Clothing', 
        'Books', 
        'Sports', 
        'Beauty'
    ];

    // ========================
    // 📝 FACTORY DEFINITION
    // ========================
    public function definition()
    {
        // Get category name from predefined list (cyclical)
        $name = $this->categories[self::$categoryIndex % count($this->categories)];
        
        // Add unique suffix if we exceed the predefined list
        $uniqueSuffix = self::$categoryIndex > count($this->categories) ? ' ' . (self::$categoryIndex + 1) : '';
        
        // Increment counter for next category
        self::$categoryIndex++;

        return [
            // Category name with unique suffix if needed
            'name' => $name . $uniqueSuffix,
            
            // URL-friendly slug generated from name
            'slug' => \Illuminate\Support\Str::slug($name . $uniqueSuffix),
        ];
    }
}