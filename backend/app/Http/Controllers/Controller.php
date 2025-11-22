<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

// ========================
// 🎯 BASE CONTROLLER CLASS
// ========================
class Controller extends BaseController
{
    // ========================
    // 🔐 TRAITS FOR CONTROLLER FUNCTIONALITY
    // ========================
    
    // AuthorizesRequests: Provides authorization methods for checking permissions
    // ValidatesRequests: Provides validation methods for incoming request data
    use AuthorizesRequests, ValidatesRequests;
    
    // This base controller is extended by all other controllers in the application
    // It provides common functionality that all controllers need
}