<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// 🔐 PERSONAL ACCESS TOKENS MIGRATION
// ========================
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ========================
        // 🗃️ CREATE PERSONAL_ACCESS_TOKENS TABLE
        // ========================
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // Polymorphic relationship - can belong to any model (typically User)
            $table->morphs('tokenable');
            
            // Token name (e.g., 'api-token', 'mobile-app')
            $table->string('name');
            
            // Unique token string (64 characters)
            $table->string('token', 64)->unique();
            
            // Abilities/permissions for the token (JSON array)
            $table->text('abilities')->nullable();
            
            // Last time the token was used
            $table->timestamp('last_used_at')->nullable();
            
            // Token expiration date
            $table->timestamp('expires_at')->nullable();
            
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
        // 🗑️ DROP PERSONAL_ACCESS_TOKENS TABLE
        // ========================
        Schema::dropIfExists('personal_access_tokens');
    }
};