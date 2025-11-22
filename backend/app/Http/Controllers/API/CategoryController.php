<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

// ========================
// 📁 CATEGORY CONTROLLER CLASS
// ========================
class CategoryController extends Controller
{
    // ========================
    // 📋 GET ALL CATEGORIES (ADMIN ONLY)
    // ========================
    public function index(Request $request)
    {
        // Check if user is admin
        $user = $request->user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Return paginated categories (15 per page)
        return response()->json(Category::paginate(15));
    }

    // ========================
    // ➕ CREATE NEW CATEGORY (ADMIN ONLY)
    // ========================
    public function store(Request $request)
    {
        // Check if user is admin
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate incoming request data
        $request->validate([
            'name' => 'required',
            'slug' => 'required|unique:categories'
        ]);

        // Create new category with name and slug
        $category = Category::create($request->only('name', 'slug'));
        
        // Return created category with HTTP status 201
        return response()->json($category, 201);
    }

    // ========================
    // 👀 GET SPECIFIC CATEGORY
    // ========================
    public function show(Category $category)
    {
        // Return single category (public access)
        return response()->json($category);
    }

    // ========================
    // ✏️ UPDATE CATEGORY (ADMIN ONLY)
    // ========================
    public function update(Request $request, Category $category)
    {
        // Check if user is admin
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate incoming request data
        $request->validate([
            'name' => 'required',
            'slug' => "required|unique:categories,slug,$category->id"
        ]);

        // Update category with new name and slug
        $category->update($request->only('name', 'slug'));
        
        // Return updated category
        return response()->json($category);
    }

    // ========================
    // 🗑️ DELETE CATEGORY (ADMIN ONLY)
    // ========================
    public function destroy(Category $category)
    {
        // Check if user is admin
        $user = request()->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Delete the category
        $category->delete();
        
        // Return empty response with HTTP status 204
        return response()->json(null, 204);
    }
}