import React, { useState } from 'react';
import Products from './Products';
import Categories from './Categories';
import Users from './Users';
import Orders from './Orders';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button onClick={()=>setActiveTab('products')}>Products</button>
        <button onClick={()=>setActiveTab('categories')}>Categories</button>
        <button onClick={()=>setActiveTab('users')}>Users</button>
        <button onClick={()=>setActiveTab('orders')}>Orders</button>
      </div>

      <div className="tab-content">
        {activeTab === 'products' && <Products />}
        {activeTab === 'categories' && <Categories />}
        {activeTab === 'users' && <Users />}
        {activeTab === 'orders' && <Orders />}
      </div>
    </div>
  );
};

export default AdminDashboard;
