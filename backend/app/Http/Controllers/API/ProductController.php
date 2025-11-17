<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // عرض كل المنتجات مع Pagination
    public function index()
    {
        $products = Product::with('category')->paginate(12);
        $products->getCollection()->transform(fn($p) => $this->formatProductResponse($p));
        return response()->json($products, 200);
    }

    // إنشاء منتج
    public function store(ProductRequest $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message'=>'Forbidden'],403);

        $data = $request->validated();

        // رفع الصورة
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products','public');
        }

        // توليد slug إذا لم يُرسل
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']).'-'.time();
        }

        $product = Product::create($data);
        return response()->json($this->formatProductResponse($product),201);
    }

    // عرض منتج واحد
    public function show(Product $product)
    {
        return response()->json($this->formatProductResponse($product),200);
    }

    // تحديث منتج
    public function update(ProductRequest $request, Product $product)
    {
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message'=>'Forbidden'],403);

        $data = $request->validated();

        // تحديث الصورة (إذا أرسل ملف جديد)
        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products','public');
        }

        // توليد slug إذا لم يُرسل
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']).'-'.time();
        }

        $product->update($data);
        return response()->json($this->formatProductResponse($product),200);
    }

    // حذف منتج
    public function destroy(Product $product)
    {
        $user = auth()->user();
        if ($user->role !== 'admin') return response()->json(['message'=>'Forbidden'],403);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return response()->json(null,204);
    }

    // البحث
    public function search(Request $request)
    {
        $query = $request->query('q');
        $products = Product::where('name','LIKE',"%{$query}%")
            ->orWhere('description','LIKE',"%{$query}%")
            ->with('category')
            ->paginate(12);

        $products->getCollection()->transform(fn($p) => $this->formatProductResponse($p));
        return response()->json($products,200);
    }

    // صياغة رد المنتج
    private function formatProductResponse($product)
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => (float) $product->price,
            'stock' => (int) $product->stock,
            'category_id' => $product->category_id,
            'category' => $product->category,
            'image' => $product->image,
            'image_url' => $this->generateImageUrl($product->image),
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];
    }

    private function generateImageUrl($imagePath)
    {
        if (!$imagePath) return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
        $filename = basename($imagePath);
        return config('app.url').'/api/images/products/'.$filename;
    }
}
