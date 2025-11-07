import React from 'react';
import Products from './Products';
import Categories from './Categories';
import Orders from './Orders';

const UserDashboard = () => {
  return (
    <div>
      <h2>User Dashboard</h2>
      <Products />
      <Categories />
      <Orders />
    </div>
  );
};

export default UserDashboard;
