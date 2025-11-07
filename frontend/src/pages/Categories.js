import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/categories', form);
      setCategories([...categories, res.data]);
      setForm({ name:'' });
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Categories</h3>
      <button onClick={()=>setShowModal(true)}>Add Category</button>
      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {c.name}
            <button onClick={()=>handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onClose={()=>setShowModal(false)}>
        <h3>Add Category</h3>
        <form onSubmit={handleAddCategory}>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <button type="submit">Add</button>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
