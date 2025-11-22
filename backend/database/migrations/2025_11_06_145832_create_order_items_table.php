<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// 📦 ORDER ITEMS MIGRATION
// ========================
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ========================
        // 🗃️ CREATE ORDER_ITEMS TABLE
        // ========================
        Schema::create('order_items', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // Foreign key to orders table with cascade delete
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            
            // Foreign key to products table with cascade delete
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            
            // Quantity of products ordered (required)
            $table->integer('quantity');
            
            // Price at time of order (preserves historical pricing)
            $table->decimal('price', 10, 2); // 10 digits, 2 decimal places
            
            // Automatic timestamps (created_at, updated_at)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ========================
        // 🗑️ DROP ORDER_ITEMS TABLE
        // ========================
        Schema::dropIfExists('order_items');
    }
};