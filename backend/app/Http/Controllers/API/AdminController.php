<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getDashboardStats()
    {
        // التحقق من أن المستخدم مسؤول
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        try {
            $stats = [
                'total_products' => Product::count(),
                'total_users' => User::count(),
                'total_orders' => Order::count(),
                'total_revenue' => Order::sum('total'),
                'low_stock_products' => Product::where('stock', '<', 10)->count(),
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
            return response()->json([
                'message' => 'Error fetching dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}