<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;

// ========================
// 🛒 CART CONTROLLER CLASS
// ========================
class CartController extends Controller
{
    // ========================
    // 📋 GET USER'S CART ITEMS
    // ========================
    public function index(Request $request)
    {
        // Get all cart items for authenticated user with product details
        $cart = CartItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        return response()->json($cart);
    }

    // ========================
    // ➕ ADD ITEM TO CART
    // ========================
    public function add(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Update or create cart item (prevents duplicates for same product)
        $item = CartItem::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
            ],
            [
                'quantity' => $request->quantity,
            ]
        );

        return response()->json($item, 201);
    }

    // ========================
    // 🗑️ REMOVE ITEM FROM CART
    // ========================
    public function destroy(Request $request, $id)
    {
        // Find cart item that belongs to authenticated user
        $item = CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        // Return 404 if item not found
        if (!$item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // Delete the cart item
        $item->delete();
        return response()->json(['message' => 'Deleted'], 204);
    }

    // ========================
    // 🧹 CLEAR ENTIRE CART
    // ========================
    public function clear(Request $request)
    {
        // Delete all cart items for authenticated user
        CartItem::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Cart cleared']);
    }

    // ========================
    // 💳 CHECKOUT PROCESS
    // ========================
    public function checkout(Request $request)
    {
        // Get all cart items with product details
        $cartItems = CartItem::where('user_id', $request->user()->id)->with('product')->get();

        // Check if cart is empty
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // Calculate total and check stock availability
        $total = 0;
        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json(['message' => 'Not enough stock for ' . $item->product->name], 400);
            }
            $total += $item->product->price * $item->quantity;
        }

        // Create new order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'total' => $total
        ]);

        // Create order items and update product stock
        foreach ($cartItems as $item) {
            // Create order item record
            $order->items()->create([
                'product_id' => $item->product->id,
                'quantity' => $item->quantity,
                'price' => $item->product->price
            ]);
            
            // Reduce product stock
            $item->product->decrement('stock', $item->quantity);
        }

        // Clear the cart after successful checkout
        CartItem::where('user_id', $request->user()->id)->delete();

        // Return success response with order details
        return response()->json([
            'message' => 'Checkout completed',
            'order' => $order->load('items.product')
        ], 201);
    }
}