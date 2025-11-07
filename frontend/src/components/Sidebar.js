import React from 'react';

const Sidebar = ({ setPage }) => (
  <div className="sidebar">
    <ul>
      <li onClick={() => setPage('adminDashboard')}>Admin Panel</li>
      <li onClick={() => setPage('products')}>Products</li>
      <li onClick={() => setPage('categories')}>Categories</li>
      <li onClick={() => setPage('users')}>Users</li>
      <li onClick={() => setPage('orders')}>Orders</li>
    </ul>
  </div>
);

export default Sidebar;
