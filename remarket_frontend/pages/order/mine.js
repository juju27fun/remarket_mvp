import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { API_FULL_URL } from '../../src/utils/constants';
import Button from '../../src/components/Button';
import {
  getAccessToken,
  isAuthenticated,
  refreshAccessToken
} from '../../src/utils/auth';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      try {
        let accessToken = getAccessToken();
        if (!isAuthenticated()) {
          accessToken = await refreshAccessToken();
        }
        const { data } = await axios.get(`${API_FULL_URL}/orders/mine`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setOrders(data);
      } catch (error) {
        setError('Error fetching your orders');
        console.error('Error fetching your orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const handleViewDetails = (id) => {
    router.push(`/order/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <div>
      <h1>My Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Total Price</th>
            <th>Payment Status</th>
            <th>Delivery Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleString()}` : 'Not Paid'}</td>
              <td>{order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleString()}` : 'Not Delivered'}</td>
              <td>
                <Button onClick={() => handleViewDetails(order._id)}>View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;