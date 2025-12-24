import React, { useState, useEffect } from 'react';
import { cartAPI } from '../../services/api/cart.api';
import { getProductImageUrl } from '../../services/api/api.config';
import './ProductItem.css';

const ProductItem = ({ product, showNotification }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // 🔍 DEBUG: تحقق من بيانات المنتج
  useEffect(() => {
    console.log('🔎 ProductItem Data:', {
      id: product.id,
      name: product.name,
      image: product.image,
      image_url: product.image_url,
      has_image: !!product.image,
      has_image_url: !!product.image_url
    });
  }, [product]);

  const getImageUrl = () => {
    console.log('🖼️ Getting image for product:', product.id);
    
    // المحاولة 1: استخدم image_url من API
    if (product.image_url && product.image_url.startsWith('http')) {
      console.log('✅ Using image_url from API');
      return product.image_url;
    }
    
    // المحاولة 2: استخدم getProductImageUrl
    if (product.image) {
      const url = getProductImageUrl(product.image);
      console.log('🔄 Generated URL:', url);
      
      // 🔥 اختتبار الرابط قبل استخدامه
      const testImg = new Image();
      testImg.src = url;
      testImg.onload = () => console.log('✅ Test: Image loads successfully');
      testImg.onerror = () => console.log('❌ Test: Image fails to load');
      
      return url;
    }
    
    // المحاولة 3: الصورة الافتراضية
    console.log('⚠️ No image found, using default');
    return 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
  };

  const imageUrl = getImageUrl();
  
  const handleImageLoad = (e) => {
    console.log('🎉 Image loaded successfully:', {
      url: imageUrl,
      naturalSize: `${e.target.naturalWidth}x${e.target.naturalHeight}`,
      elementSize: `${e.target.width}x${e.target.height}`
    });
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.error('💥 Image failed to load:', {
      attemptedUrl: imageUrl,
      productId: product.id,
      productName: product.name
    });
    
    setImageError(true);
    
    // استخدم الصورة الافتراضية
    e.target.src = 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
    e.target.style.objectFit = 'contain';
    e.target.style.backgroundColor = '#f5f5f5';
  };

  const handleAddToCart = async () => {
    if (product.stock < 1) return;

    try {
      setAddingToCart(true);
      // Add 1 by default, you could open popup to choose quantity
      await cartAPI.add({ product_id: product.id, quantity: 1 });

      // Notify other parts of the app that cart changed
      window.dispatchEvent(new Event('cartUpdated'));
      // Also ask app to open the cart view so user sees the added item
      window.dispatchEvent(new Event('openCart'));

      showNotification(`Added 1 × ${product.name} to cart`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      let message = 'Failed to add to cart';
      if (error.message && error.message.includes('AUTH_REQUIRED')) {
        message = 'Please log in to add items to your cart';
      }
      showNotification(message, 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToCartConfirm = async () => {
    try {
      setAddingToCart(true);
      await cartAPI.add({
        product_id: product.id,
        quantity: quantity
      });
      showNotification(`Added ${quantity} x ${product.name} to cart successfully!`, 'success');
      setShowCartPopup(false);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const closeCartPopup = () => {
    setShowCartPopup(false);
    setQuantity(1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <>
      <div className="product-item-card">
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="product-image"
            style={{
              objectFit: 'contain',
              backgroundColor: '#f5f5f5',
              border: imageError ? '2px solid red' : '1px solid #ddd'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="luxury-badge">Premium</div>
          
          {/* 🔥 مؤشر تحميل/خطأ */}
          {imageError && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(255,0,0,0.7)',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px'
            }}>
              Image Error
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <p className="product-description">
            {product.description ? 
              (product.description.length > 100 ? 
                `${product.description.substring(0, 100)}...` : 
                product.description
              ) : 
              'Experience luxury in every scent'
            }
          </p>
          
          <div className="product-meta">
            <span className="product-price">{product.price} DH</span>
            <span className={`product-stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
              {product.stock > 0 ? `${product.stock} Available` : 'Out of Stock'}
            </span>
          </div>

          {product.notes && (
            <div className="fragrance-notes">
              <span className="notes-label">Scent Notes:</span>
              <span className="notes-value">{product.notes}</span>
            </div>
          )}
        </div>

        <div className="product-actions">
          <button
            className={`product-btn ${product.stock < 1 ? 'btn-out-of-stock' : 'btn-add-cart'}`}
            onClick={handleAddToCart}
            disabled={product.stock < 1 || addingToCart}
          >
            {product.stock < 1 ? 'Out of Stock' : (addingToCart ? 'Adding...' : 'Add to Cart')}
          </button>
        </div>
      </div>

      {/* باقي كود الـ popup كما هو */}
    </>
  );
};

export default ProductItem;