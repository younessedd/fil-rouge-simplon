<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(){ return response()->json(Category::all()); }

    public function store(Request $r){
        $r->validate(['name'=>'required','slug'=>'required|unique:categories']);
        $cat = Category::create($r->only('name','slug'));
        return response()->json($cat,201);
    }

    public function show(Category $category){ return response()->json($category); }

    public function update(Request $r, Category $category){
        $r->validate(['name'=>'required','slug'=>"required|unique:categories,slug,$category->id"]);
        $category->update($r->only('name','slug'));
        return response()->json($category);
    }

    public function destroy(Category $category){
        $category->delete();
        return response()->json(null,204);
    }
}
