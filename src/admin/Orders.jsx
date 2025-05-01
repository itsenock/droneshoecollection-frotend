// src/admin/Orders.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.warn('Admin login required.');
          return;
        }
        // Fetch orders from your backend orders endpoint
        const response = await axios.get('https://campusbackend-production.up.railway.app/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Error fetching orders.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders">
      <h2>Platform Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order Ref.</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.reference}</td>
              <td>{order.buyer && order.buyer.fullname ? order.buyer.fullname : 'Unknown'}</td>
              <td>{order.seller && order.seller.fullname ? order.seller.fullname : 'Unknown'}</td>
              <td>{order.item ? order.item : 'N/A'}</td>
              <td>{order.amount} {order.currency}</td>
              <td>{order.status}</td>
              <td>{order.paid_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
