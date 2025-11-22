<?php

// ========================
// 🗂️ MIGRATION IMPORTS
// ========================
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ========================
// ❌ FAILED JOBS MIGRATION
// ========================
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ========================
        // 🗃️ CREATE FAILED_JOBS TABLE
        // ========================
        Schema::create('failed_jobs', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // Unique identifier for the failed job
            $table->string('uuid')->unique();
            
            // Queue connection name
            $table->text('connection');
            
            // Queue name where the job failed
            $table->text('queue');
            
            // Job data and payload
            $table->longText('payload');
            
            // Exception details and stack trace
            $table->longText('exception');
            
            // Automatic timestamp when job failed
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ========================
        // 🗑️ DROP FAILED_JOBS TABLE
        // ========================
        Schema::dropIfExists('failed_jobs');
    }
};