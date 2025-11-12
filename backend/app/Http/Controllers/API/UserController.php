<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(User::all());
    }

    public function show(Request $request, User $user)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($user);
    }

    public function store(Request $request)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,admin',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city']
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|required|in:user,admin',
            'phone' => 'sometimes|required|string|max:20',
            'address' => 'sometimes|required|string|max:500',
            'city' => 'sometimes|required|string|max:100'
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy(Request $request, User $user)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}