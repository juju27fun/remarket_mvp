import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_FULL_URL } from '../../src/utils/constants';
import Button from '../../src/components/Button';
import {
  getAccessToken,
  isAuthenticated,
  refreshAccessToken
} from '../../src/utils/auth';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        let accessToken = getAccessToken();
        if (!isAuthenticated()) {
          accessToken = await refreshAccessToken();
        }
        const { data } = await axios.get(`${API_FULL_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setOrders(data);
      } catch (error) {
        setError('Error fetching orders');
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    router.push(`/order/${orderId}`);
  };

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/signin">Signin</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/order/create">Create Order</Link>
        <Link href="/order/mine">My Orders</Link>
        <Link href="/order/summary">Order Summary</Link>
      </nav>
      <h1>Order List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
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
                <td>{order.user.name}</td>
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

export default OrderList;