<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(){ return true; }

    public function rules(){
        $id = $this->route('product')?->id;
        return [
            'name'=>'required|string|max:255',
            'slug'=>"nullable|string|unique:products,slug,$id",
            'description'=>'nullable|string',
            'price'=>'required|numeric',
            'stock'=>'nullable|integer',
            'category_id'=>'nullable|exists:categories,id',
            'image'=>'nullable|string'
        ];
    }
}
