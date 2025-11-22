<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// 📁 CATEGORIES MIGRATION
// ========================
class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // ========================
        // 🗃️ CREATE CATEGORIES TABLE
        // ========================
        Schema::create('categories', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // Category display name
            $table->string('name');
            
            // URL-friendly unique identifier
            $table->string('slug')->unique();
            
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
        // 🗑️ DROP CATEGORIES TABLE
        // ========================
        Schema::dropIfExists('categories');
    }
}