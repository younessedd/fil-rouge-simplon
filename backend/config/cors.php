<?php

// ========================
// 🌐 CORS CONFIGURATION FILE
// ========================
return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // ========================
    // 🛣️ PATHS CONFIGURATION
    // ========================
    'paths' => [
        'api/*',              // Apply CORS to all API routes
        'sanctum/csrf-cookie' // Allow CSRF cookie for Sanctum authentication
    ],

    // ========================
    // 🔧 ALLOWED HTTP METHODS
    // ========================
    'allowed_methods' => [
        '*'  // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    ],

    // ========================
    // 🌍 ALLOWED ORIGINS (FRONTEND URLs)
    // ========================
    'allowed_origins' => [
        'http://localhost:5173',  // Vite development server (React/Vue)
        'http://localhost:3000'   // Create React App development server
    ],

    // ========================
    // 🎯 ALLOWED ORIGINS PATTERNS
    // ========================
    'allowed_origins_patterns' => [
        // Regular expressions for dynamic origin matching
        // (Currently empty - using specific origins above)
    ],

    // ========================
    // 📋 ALLOWED HEADERS
    // ========================
    'allowed_headers' => [
        '*'  // Allow all headers (Content-Type, Authorization, etc.)
    ],

    // ========================
    // 📢 EXPOSED HEADERS
    // ========================
    'exposed_headers' => [
        // Headers exposed to the frontend
        // (Currently empty - no custom headers needed)
    ],

    // ========================
    // ⏱️ MAX AGE (CACHE DURATION)
    // ========================
    'max_age' => 0,  // Preflight request cache duration in seconds (0 = disabled)

    // ========================
    // 🔐 CREDENTIALS SUPPORT
    // ========================
    'supports_credentials' => false,  // Allow cookies and authentication headers

];