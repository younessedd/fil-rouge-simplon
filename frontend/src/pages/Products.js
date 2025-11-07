// src/pages/Products.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Modal from '../components/Modal';

const Products = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category_id: '',
  });

  // جلب المنتجات
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      // تعديل هنا حسب شكل البيانات من الـ API
      setProducts(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // جلب الفئات
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async () => {
    try {
      const res = await api.post('/products', newProduct);
      setProducts([...products, res.data]);
      setShowModal(false);
      setNewProduct({ name: '', price: '', category_id: '' });
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  if (!Array.isArray(products)) return <p>Loading...</p>;

  return (
    <div>
      <h2>Products</h2>

      {user.role === 'admin' && (
        <button onClick={() => setShowModal(true)}>Add Product</button>
      )}

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - ${p.price} - Category: {p.category?.name || 'N/A'}
            {user.role === 'admin' && (
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3>Add New Product</h3>
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
          />
          <select
            value={newProduct.category_id}
            onChange={e => setNewProduct({...newProduct, category_id: e.target.value})}
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button onClick={handleAddProduct}>Add</button>
        </Modal>
      )}
    </div>
  );
};

export default Products;
