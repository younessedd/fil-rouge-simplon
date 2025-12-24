<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

// ========================
// 🛒 ORDER CONTROLLER CLASS
// ========================
class OrderController extends Controller
{
    // ========================
    // ➕ CREATE NEW ORDER
    // ========================
    public function store(Request $request)
    {
        // Validate incoming order items
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Get authenticated user and initialize total
        $user = auth()->user();
        $total = 0;

        // Check stock availability and calculate total
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product->stock < $item['quantity']) {
                return response()->json(['error' => 'Not enough stock for product: ' . $product->name], 400);
            }
            $total += $product->price * $item['quantity'];
        }

        // Create main order record
        $order = Order::create([
            'user_id' => $user->id,
            'total' => $total,
        ]);

        // Create order items and update product stock
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            
            // Create order item
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);
            
            // Reduce product stock
            $product->decrement('stock', $item['quantity']);
        }

        // Return success response with order data
        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items.product')
        ], 201);
    }

    // ========================
    // 📋 GET USER'S ORDERS
    // ========================
    public function index(Request $request)
    {
        // Get paginated orders for authenticated user
        $orders = Order::where('user_id', auth()->id())
            ->with('items.product') // Include items and product details
            ->orderBy('created_at', 'desc') // Latest orders first
            ->paginate(10);

        return response()->json($orders);
    }

    // ========================
    // 👀 GET SPECIFIC ORDER
    // ========================
    public function show($id)
    {
        // Get specific order for authenticated user
        $order = Order::where('user_id', auth()->id())
            ->with('items.product') // Include items and product details
            ->findOrFail($id);
            
        return response()->json($order);
    }

    // ========================
    // 👑 GET ALL ORDERS (ADMIN ONLY)
    // ========================
    public function allOrdersForAdmin(Request $request)
    {
        // Check if user is admin
        $user = auth()->user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Get all orders with user and product details
        $orders = Order::with(['items.product', 'user'])
            ->orderBy('created_at', 'desc') // Latest orders first
            ->paginate(15);

        return response()->json($orders, 200);
    }

    // ========================
    // 🗑️ DELETE ORDER (USER)
    // ========================
    public function destroy($id)
    {
        // Find and delete user's order
        $order = Order::where('user_id', auth()->id())->findOrFail($id);
        $order->delete();
        
        return response()->json(['message' => 'Order deleted successfully'], 200);
    }

    // ========================
    // 🛡️ ADMIN DELETE ORDER (ADMIN ONLY)
    // ========================
    public function adminDestroy($id)
    {
        // Only admins can delete arbitrary orders
        $user = auth()->user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Find the order (no user scoping for admins)
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted by admin successfully'], 200);
    }
}