<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// 📦 PRODUCTS MIGRATION
// ========================
class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // ========================
        // 🗃️ CREATE PRODUCTS TABLE
        // ========================
        Schema::create('products', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // Product name
            $table->string('name');
            
            // URL-friendly unique identifier
            $table->string('slug')->unique();
            
            // Product description (optional)
            $table->text('description')->nullable();
            
            // Product price with decimal precision
            $table->decimal('price', 10, 2);
            
            // Inventory quantity (default: 0)
            $table->integer('stock')->default(0);
            
            // Foreign key to categories table with null on delete
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            
            // Product image path (optional)
            $table->string('image')->nullable();
            
            // Automatic timestamps (created_at, updated_at)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        // ========================
        // 🗑️ DROP PRODUCTS TABLE
        // ========================
        Schema::dropIfExists('products');
    }
}