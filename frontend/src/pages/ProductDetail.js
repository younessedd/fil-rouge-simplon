import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, imageHelpers } from '../services/api';
import Loading from '../components/Loading';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch product details when component mounts
  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  // Fetch product details from API
  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getOne(id);
      setProduct(response.data);
    } catch (error) {
      setError('Product not found');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity increase
  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    // This will be implemented when we create cart functionality
    console.log('Adding to cart:', { product, quantity });
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  // Handle buy now
  const handleBuyNow = () => {
    // This will be implemented when we create order functionality
    console.log('Buy now:', { product, quantity });
    alert(`Buy now functionality coming soon!`);
  };

  // Handle back to products
  const handleBackToProducts = () => {
    navigate('/products');
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <div className="error-container">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={handleBackToProducts} className="back-button">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Back Button */}
        <button onClick={handleBackToProducts} className="back-button">
          ← Back to Products
        </button>

        {/* Product Detail Content */}
        <div className="product-detail-content">
          {/* Product Image */}
          <div className="product-image-section">
            <img
              src={imageHelpers.getProductImageUrl(product.image)}
              alt={product.name}
              className="product-detail-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500/CCCCCC/FFFFFF?text=No+Image';
              }}
            />
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            {/* Product Category */}
            {product.category && (
              <p className="product-category">
                Category: <span>{product.category.name}</span>
              </p>
            )}

            {/* Product Price */}
            <div className="product-price-section">
              <span className="product-price">${product.price}</span>
              {product.stock > 0 ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Product Description */}
            <div className="product-description-section">
              <h3>Description</h3>
              <p className="product-description">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Stock Information */}
            <div className="stock-info">
              <p>Available: {product.stock} units</p>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="quantity-section">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    onClick={handleIncreaseQuantity}
                    disabled={quantity >= product.stock}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              {product.stock > 0 ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="add-to-cart-btn"
                  >
                    Add to Cart ({quantity})
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="buy-now-btn"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <button disabled className="out-of-stock-btn">
                  Out of Stock
                </button>
              )}
            </div>

            {/* Additional Product Info */}
            <div className="additional-info">
              <div className="info-item">
                <strong>SKU:</strong> #{product.id}
              </div>
              <div className="info-item">
                <strong>Added:</strong> {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;