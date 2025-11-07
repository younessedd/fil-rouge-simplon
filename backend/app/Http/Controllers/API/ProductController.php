<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(){ return response()->json(Product::with('category')->paginate(12)); }

    public function store(ProductRequest $request){
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message'=>'Forbidden'],403);

        $data = $request->validated();
        if (empty($data['slug'])) $data['slug'] = Str::slug($data['name']).'-'.time();
        $prod = Product::create($data);
        return response()->json($prod,201);
    }

    public function show(Product $product){ return response()->json($product); }

    public function update(ProductRequest $request, Product $product){
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message'=>'Forbidden'],403);
        $product->update($request->validated());
        return response()->json($product);
    }

    public function destroy(Request $request, Product $product){
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message'=>'Forbidden'],403);
        $product->delete();
        return response()->json(null,204);
    }
}
