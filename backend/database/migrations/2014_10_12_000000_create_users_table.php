<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// 👥 USERS MIGRATION
// ========================
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ========================
        // 🗃️ CREATE USERS TABLE
        // ========================
        Schema::create('users', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // User's full name
            $table->string('name');
            
            // Unique email address for login
            $table->string('email')->unique();
            
            // Hashed password for authentication
            $table->string('password');
            
            // User role (default: 'user', can be 'admin')
            $table->string('role')->default('user');
            
            // User's phone number (optional)
            $table->string('phone')->nullable();
            
            // User's physical address (optional)
            $table->text('address')->nullable();
            
            // User's city (optional)
            $table->string('city')->nullable();
            
            // "Remember me" token for persistent sessions
            $table->rememberToken();
            
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
        // 🗑️ DROP USERS TABLE
        // ========================
        Schema::dropIfExists('users');
    }
};