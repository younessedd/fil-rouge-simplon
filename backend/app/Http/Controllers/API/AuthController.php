<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Validator;

// ========================
// 🔐 AUTH CONTROLLER CLASS
// ========================
class AuthController extends Controller
{
    // ========================
    // 📝 USER REGISTRATION
    // ========================
    public function register(Request $request)
    {
        // Validate incoming registration data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100'
        ]);

        // Create new user with default 'user' role
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user', // Default role for new users
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city']
        ]);

        // Generate API token for the new user
        $token = $user->createToken('api-token')->plainTextToken;

        // Return user data and token
        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // ========================
    // 🔑 USER LOGIN
    // ========================
    public function login(Request $request)
    {
        // Validate login credentials
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Find user by email
        $user = User::where('email', $validated['email'])->first();
        
        // Check if user exists and password is correct
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Generate new API token
        $token = $user->createToken('api-token')->plainTextToken;
        
        // Return user data and token
        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    // ========================
    // 🚪 USER LOGOUT
    // ========================
    public function logout(Request $request)
    {
        // Delete current access token
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    // ========================
    // 👤 GET CURRENT USER PROFILE
    // ========================
    public function me(Request $request)
    {
        // Return authenticated user data
        return response()->json($request->user());
    }

    // ========================
// 👤 UPDATE USER PROFILE
// ========================
 public function updateProfile(Request $request)
{
    \Log::info('Profile update endpoint hit', ['user_id' => $request->user()->id, 'data' => $request->all()]);
    
    try {
        $user = $request->user();
        
        \Log::info('User found', ['user_id' => $user->id]);
        
        // Validate the incoming data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        \Log::info('Validation passed');

        // Get validated data
        $validatedData = $validator->validated();

        // Update user data
        $user->update([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'] ?? null,
            'city' => $validatedData['city'] ?? null,
            'address' => $validatedData['address'] ?? null,
        ]);

        \Log::info('User updated successfully', ['user_id' => $user->id]);

        // Return updated user data
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh()
        ]);

    } catch (\Exception $e) {
        \Log::error('Profile update error: ' . $e->getMessage());
        
        return response()->json([
            'message' => 'Failed to update profile',
            'error' => $e->getMessage()
        ], 500);
    }
}

}