<?php

// ========================
// 🗂️ NAMESPACE AND IMPORTS
// ========================
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

// ========================
// 📦 PRODUCT CONTROLLER CLASS
// ========================
class ProductController extends Controller
{
    // ========================
    // 📋 GET ALL PRODUCTS (PAGINATED)
    // ========================
    public function index()
    {
        // Get products with category relationship, paginated (12 per page)
        $products = Product::with('category')->paginate(12);
        
        // Transform each product using formatProductResponse method
        $products->getCollection()->transform(fn($p) => $this->formatProductResponse($p));
        
        return response()->json($products, 200);
    }

    // ========================
    // ➕ CREATE NEW PRODUCT
    // ========================
    public function store(ProductRequest $request)
    {
        // Check if current user is admin
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        // Get validated data from ProductRequest
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . time();
        }

        // Create new product
        $product = Product::create($data);
        
        // Return formatted product response
        return response()->json($this->formatProductResponse($product), 201);
    }

    // ========================
    // 👀 GET SINGLE PRODUCT
    // ========================
    public function show(Product $product)
    {
        // Return formatted single product
        return response()->json($this->formatProductResponse($product), 200);
    }

    // ========================
    // ✏️ UPDATE EXISTING PRODUCT
    // ========================
    public function update(ProductRequest $request, Product $product)
    {
        // Check if current user is admin
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        $data = $request->validated();

        // Handle image update (if new file uploaded)
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            // Store new image
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . time();
        }

        // Update product with new data
        $product->update($data);
        
        // Return formatted updated product
        return response()->json($this->formatProductResponse($product), 200);
    }

    // ========================
    // 🗑️ DELETE PRODUCT
    // ========================
    public function destroy(Product $product)
    {
        // Check if current user is admin
        $user = auth()->user();
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        // Delete product image if exists
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        // Delete product from database
        $product->delete();
        
        return response()->json(null, 204);
    }

    // ========================
    // 🔍 SEARCH PRODUCTS
    // ========================
    public function search(Request $request)
    {
        // Get search query from request
        $query = $request->query('q');
        
        // Search in product name and description
        $products = Product::where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->with('category')
            ->paginate(12);

        // Transform each product using formatProductResponse method
        $products->getCollection()->transform(fn($p) => $this->formatProductResponse($p));
        
        return response()->json($products, 200);
    }

    // ========================
    // 🎨 FORMAT PRODUCT RESPONSE
    // ========================
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

    // ========================
    // 🌐 GENERATE IMAGE URL
    // ========================
    private function generateImageUrl($imagePath)
    {
        // Return placeholder if no image
        if (!$imagePath) return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
        
        // Extract filename from path
        $filename = basename($imagePath);
        
        // Generate full image URL using app configuration
        return config('app.url') . '/api/images/products/' . $filename;
    }
}