<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Prefer returning null for JSON/API requests so they get a 401 JSON response
        if ($request->expectsJson()) {
            return null;
        }

        // If a named 'login' route exists (web), redirect to it; otherwise return null
        if (\Illuminate\Support\Facades\Route::has('login')) {
            return route('login');
        }

        return null;
    }
}
