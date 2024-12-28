import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { API_FULL_URL } from '../../src/utils/constants';
import Button from '../../src/components/Button';
import Link from 'next/link';
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

  const handleViewDetails = (orderId) => {
    router.push(`/order/${orderId}`);
  };

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/order">Order Index</Link>
      </nav>
      <h1>My Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
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
      )}
    </div>
  );
};

export default MyOrders;