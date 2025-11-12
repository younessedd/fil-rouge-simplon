<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name','slug','description','price','stock','category_id','image'];
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // دالة مساعدة للحصول على رابط الصورة
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
        }
        
        $baseUrl = config('app.url', 'http://localhost:8000');
        return $baseUrl . '/storage/' . ltrim($this->image, '/');
    }
}