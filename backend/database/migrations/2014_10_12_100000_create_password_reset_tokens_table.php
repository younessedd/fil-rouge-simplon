<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// 🔑 PASSWORD RESET TOKENS MIGRATION
// ========================
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ========================
        // 🗃️ CREATE PASSWORD_RESET_TOKENS TABLE
        // ========================
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            // Primary key - user's email address
            $table->string('email')->primary();
            
            // Reset token for password reset links
            $table->string('token');
            
            // When the token was created
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ========================
        // 🗑️ DROP PASSWORD_RESET_TOKENS TABLE
        // ========================
        Schema::dropIfExists('password_reset_tokens');
    }
};