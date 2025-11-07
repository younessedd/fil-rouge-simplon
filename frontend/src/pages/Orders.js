import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Orders</h3>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            User: {o.user?.name} - Total: ${o.total}
            <ul>
              {o.items.map(i => (
                <li key={i.id}>{i.product.name} x{i.quantity}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
