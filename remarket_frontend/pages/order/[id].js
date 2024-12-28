import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_FULL_URL } from '../../src/utils/constants';

const OrderDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Extract the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const { data } = await axios.get(`${API_FULL_URL}/orders/${id}`);
          setOrder(data);
        } catch (error) {
          console.error('Error fetching order details', error);
          setError('Error fetching order details. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <nav>
        <Link href="/order">Order Index</Link>
        <Link href="/order/summary">Order Summary</Link>
      </nav>
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Customer:</strong> {order.user.name} ({order.user.email})</p>
      <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Order Summary</h2>
      <p><strong>Items Price:</strong> ${order.itemsPrice.toFixed(2)}</p>
      <p><strong>Tax Price:</strong> ${order.taxPrice.toFixed(2)}</p>
      <p><strong>Shipping Price:</strong> ${order.shippingPrice.toFixed(2)}</p>
      <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>

      <h2>Shipping Address</h2>
      <p>{order.shippingAddress.fullName}</p>
      <p>{order.shippingAddress.address}</p>
      <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
      <p>{order.shippingAddress.country}</p>

      <h2>Payment Status</h2>
      <p>{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleString()}` : 'Not Paid'}</p>

      <h2>Delivery Status</h2>
      <p>{order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleString()}` : 'Not Delivered'}</p>
    </div>
  );
};

export default OrderDetails;