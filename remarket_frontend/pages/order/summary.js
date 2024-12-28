import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { API_FULL_URL } from '../../src/utils/constants';
import { formatDate } from '../../src/utils/format';
import {
  getAccessToken,
  isAuthenticated,
  refreshAccessToken
} from '../../src/utils/auth';
import Button from '../../src/components/Button';

const OrderSummary = () => {
  const [summary, setSummary] = useState({
    users: [],
    orders: [],
    dailyOrders: [],
    productCategories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        let accessToken = getAccessToken();
        if (!isAuthenticated()) {
          accessToken = await refreshAccessToken();
        }
        const { data } = await axios.get(`${API_FULL_URL}/orders/summary`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setSummary(data);
      } catch (error) {
        setError('Error fetching order summary');
        console.error('Error fetching order summary', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handlePayment = () => {
    // Logic for handling payment
    console.log('Payment confirmed');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <nav>
        <Link href="/order">Order Index</Link>
        <Link href="/order/mine">My Orders</Link>
      </nav>
      <h1>Order Summary</h1>
      {summary.orders.length > 0 && (
        <div>
          <h2>Order Details</h2>
          <p>Order ID: {summary.orders[0]._id}</p>
          <p>Customer: {summary.orders[0].user.name}</p>
          <p>Order Date: {formatDate(summary.orders[0].createdAt)}</p>
          <p>Shipping Address: {summary.orders[0].shippingAddress.fullName}, {summary.orders[0].shippingAddress.address}, {summary.orders[0].shippingAddress.city}, {summary.orders[0].shippingAddress.postalCode}, {summary.orders[0].shippingAddress.country}</p>
          <p>Payment Method: {summary.orders[0].paymentMethod}</p>
          <h3>Items</h3>
          <ul>
            {summary.orders[0].orderItems.map(item => (
              <li key={item._id}>
                {item.name} - {item.qty} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total Price: ${summary.orders[0].totalPrice.toFixed(2)}</p>
          <Button onClick={handlePayment}>Pay</Button>
          <Button onClick={() => router.push(`/order/${summary.orders[0]._id}`)}>View Order Details</Button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;