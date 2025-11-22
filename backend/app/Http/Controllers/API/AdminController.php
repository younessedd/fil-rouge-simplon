<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Http\Request;

// ========================
// 👑 ADMIN CONTROLLER CLASS
// ========================
class AdminController extends Controller
{
    // ========================
    // 📊 GET DASHBOARD STATISTICS
    // ========================
    public function getDashboardStats()
    {
        // Check if user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        try {
            // Compile dashboard statistics
            $stats = [
                // Total products count
                'total_products' => Product::count(),
                
                // Total users count
                'total_users' => User::count(),
                
                // Total orders count
                'total_orders' => Order::count(),
                
                // Total revenue from all orders
                'total_revenue' => Order::sum('total'),
                
                // Products with low stock (less than 10)
                'low_stock_products' => Product::where('stock', '<', 10)->count(),
                
                // Recent orders with user and product details
                'recent_orders' => Order::with(['user', 'items.product'])
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function($order) {
                        return [
                            'id' => $order->id,
                            'total' => $order->total,
                            'created_at' => $order->created_at,
                            'user' => $order->user ? [
                                'id' => $order->user->id,
                                'name' => $order->user->name,
                                'email' => $order->user->email
                            ] : null,
                            'items_count' => $order->items->count()
                        ];
                    })
            ];

            return response()->json($stats);

        } catch (\Exception $e) {
            // Handle any errors that occur during data fetching
            return response()->json([
                'message' => 'Error fetching dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}