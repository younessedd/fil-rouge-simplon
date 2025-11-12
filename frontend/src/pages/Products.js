import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import './Products.css';

const Products = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search term or category changes
  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  // Fetch all products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.data || response.data);
    } catch (error) {
      setError('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term and category
  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category_id === parseInt(selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle add to cart functionality
  const handleAddToCart = async (product) => {
    try {
      // This will be implemented when we create the cart functionality
      console.log('Adding to cart:', product);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Page Header */}
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Discover our amazing collection of products</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="products-error">
            {error}
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="products-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-box">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {/* Categories will be dynamically loaded when we implement categories API */}
              <option value="1">Electronics</option>
              <option value="2">Clothing</option>
              <option value="3">Home & Garden</option>
            </select>
          </div>

          {(searchTerm || selectedCategory) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>

        {/* Products Count */}
        <div className="products-count">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                showAddButton={true}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;