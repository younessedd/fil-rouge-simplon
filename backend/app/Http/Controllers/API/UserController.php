<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// ========================
// 👥 USER CONTROLLER CLASS
// ========================
class UserController extends Controller
{
    // ========================
    // 📋 GET ALL USERS (PAGINATED)
    // ========================
    public function index(Request $request)
    {
        // Check if current user is admin
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Return paginated list of users (15 per page)
        return response()->json(User::paginate(15));
    }

    // ========================
    // 👀 GET SPECIFIC USER
    // ========================
    public function show(Request $request, User $user)
    {
        // Check if current user is admin
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Return the specific user data
        return response()->json($user);
    }

    // ========================
    // ➕ CREATE NEW USER
    // ========================
    public function store(Request $request)
    {
        // Check if current user is admin
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,admin',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100'
        ]);

        // Create new user with hashed password
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city']
        ]);

        // Return created user with HTTP status 201 (Created)
        return response()->json($user, 201);
    }

    // ========================
    // ✏️ UPDATE EXISTING USER
    // ========================
    public function update(Request $request, User $user)
    {
        // Check if current user is admin
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate incoming request data (all fields are optional)
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|required|in:user,admin',
            'phone' => 'sometimes|required|string|max:20',
            'address' => 'sometimes|required|string|max:500',
            'city' => 'sometimes|required|string|max:100'
        ]);

        // Hash password if provided, otherwise remove from update data
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Update user with validated data
        $user->update($validated);

        // Return updated user data
        return response()->json($user);
    }

    // ========================
    // 🗑️ DELETE USER
    // ========================
    public function destroy(Request $request, User $user)
    {
        // Check if current user is admin
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Delete the user
        $user->delete();
        
        // Return success message
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}