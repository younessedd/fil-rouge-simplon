<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// 📋 ORDERS MIGRATION
// ========================
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ========================
        // 🗃️ CREATE ORDERS TABLE
        // ========================
        Schema::create('orders', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // Foreign key to users table with cascade delete
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Total order amount with decimal precision
            $table->decimal('total', 10, 2)->default(0);
            
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
        // 🗑️ DROP ORDERS TABLE
        // ========================
        Schema::dropIfExists('orders');
    }
};