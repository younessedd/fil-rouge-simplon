<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    private static $categoryIndex = 0;
    
    private $categories = [
        'Electronics', 'Mobile Phones', 'Laptops', 'Tablets', 'Accessories',
        'Home Appliances', 'Clothing', 'Books', 'Sports', 'Beauty'
    ];

    public function definition()
    {
        $name = $this->categories[self::$categoryIndex % count($this->categories)];
        $uniqueSuffix = self::$categoryIndex > count($this->categories) ? ' ' . (self::$categoryIndex + 1) : '';
        
        self::$categoryIndex++;

        return [
            'name' => $name . $uniqueSuffix,
            'slug' => \Illuminate\Support\Str::slug($name . $uniqueSuffix),
        ];
    }
}