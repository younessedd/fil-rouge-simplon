<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// 🛒 CART ITEMS MIGRATION
// ========================
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ========================
        // 🗃️ CREATE CART_ITEMS TABLE
        // ========================
        Schema::create('cart_items', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // Foreign key to users table with cascade delete
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Foreign key to products table with cascade delete
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            
            // Quantity of products in cart (default: 1)
            $table->integer('quantity')->default(1);
            
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
        // 🗑️ DROP CART_ITEMS TABLE
        // ========================
        Schema::dropIfExists('cart_items');
    }
};