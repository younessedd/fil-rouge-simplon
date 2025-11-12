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
    public function index()
    {
        $products = Product::with('category')->paginate(12);
        
        $products->getCollection()->transform(function ($product) {
            return $this->formatProductResponse($product);
        });
        
        return response()->json($products, 200);
    }

    public function store(ProductRequest $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $data['image'] = $imagePath;
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . time();
        }

        $product = Product::create($data);

        return response()->json($this->formatProductResponse($product), 201);
    }

    public function show(Product $product)
    {
        return response()->json($this->formatProductResponse($product), 200);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }

        $product->update($data);

        return response()->json($this->formatProductResponse($product), 200);
    }

    public function destroy(Request $request, Product $product)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return response()->json(null, 204);
    }

    public function search(Request $request)
    {
        $query = $request->query('q');

        $products = Product::where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->with('category')
            ->get();

        $products->transform(function ($product) {
            return $this->formatProductResponse($product);
        });

        return response()->json($products);
    }

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
        if (!$imagePath) {
            return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
        }
        
        $baseUrl = config('app.url', 'http://localhost:8000');
        return $baseUrl . '/storage/' . ltrim($imagePath, '/');
    }

    public function debugImages()
    {
        $products = Product::all();
        $debugInfo = [];
        
        foreach ($products as $product) {
            $debugInfo[] = [
                'id' => $product->id,
                'name' => $product->name,
                'image_path' => $product->image,
                'image_url' => $this->generateImageUrl($product->image),
                'storage_exists' => $product->image ? Storage::disk('public')->exists($product->image) : false,
            ];
        }
        
        return response()->json($debugInfo);
    }
}