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
        $products->getCollection()->transform(fn($p) => $this->formatProductResponse($p));
        return response()->json($products, 200);
    }

    public function store(ProductRequest $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
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
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . time();
        }

        $product->update($data);
        return response()->json($this->formatProductResponse($product), 200);
    }

    public function destroy(Product $product)
    {
        $user = auth()->user();
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

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
            ->paginate(12);

        $products->getCollection()->transform(fn($p) => $this->formatProductResponse($p));
        return response()->json($products, 200);
    }

    public function debugImages()
    {
        $products = Product::all();
        $debugInfo = [];
        
        foreach ($products as $product) {
            $filename = $product->image ? basename($product->image) : null;
            $debugInfo[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'image_in_db' => $product->image,
                'filename' => $filename,
                'storage_exists' => $filename ? file_exists(storage_path('app/public/products/' . $filename)) : false,
                'public_exists' => $filename ? file_exists(public_path('storage/products/' . $filename)) : false,
                'generated_url' => $this->generateImageUrl($product->image),
                'direct_test_url' => $filename ? url("storage/products/{$filename}") : null,
            ];
        }
        
        return response()->json($debugInfo);
    }

    public function checkStorage()
    {
        $storagePath = storage_path('app/public/products/');
        $publicPath = public_path('storage/products/');
        
        return response()->json([
            'storage_path' => $storagePath,
            'storage_exists' => file_exists($storagePath),
            'public_path' => $publicPath,
            'public_exists' => file_exists($publicPath),
            'storage_files' => file_exists($storagePath) ? scandir($storagePath) : [],
            'public_files' => file_exists($publicPath) ? scandir($publicPath) : [],
            'storage_link' => file_exists(public_path('storage')) ? 'Exists' : 'Missing'
        ]);
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
        if (!$imagePath) return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
        $filename = basename($imagePath);
        return url("storage/products/{$filename}");
    }
}