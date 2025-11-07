<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;


use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

class OrderController extends Controller
{
    // إنشاء طلب جديد
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = auth()->user();
        $total = 0;

        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product->stock < $item['quantity']) {
                return response()->json(['error' => 'Not enough stock for product: ' . $product->name], 400);
            }
            $total += $product->price * $item['quantity'];
        }

        $order = Order::create([
            'user_id' => $user->id,
            'total' => $total,
        ]);

        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);
            $product->decrement('stock', $item['quantity']);
        }

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items.product')
        ], 201);
    }

    // عرض جميع الطلبات الخاصة بالمستخدم
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())->with('items.product')->get();
        return response()->json($orders);
    }

    // عرض تفاصيل طلب واحد
    public function show($id)
    {
        $order = Order::where('user_id', auth()->id())->with('items.product')->findOrFail($id);
        return response()->json($order);
    }
}
