import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_FULL_URL } from '../../src/utils/constants';
import Button from '../../src/components/Button';
import {
  getAccessToken,
  isAuthenticated,
  refreshAccessToken,
} from '../../src/utils/auth';
import StripeCheckout from '../../src/components/StripeCheckout';

const CreateOrder = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      const storedItems = localStorage.getItem('cartItems');
      setCartItems(storedItems ? JSON.parse(storedItems) : []);
    };
    fetchCartItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let accessToken = getAccessToken();
      if (!isAuthenticated()) {
        accessToken = await refreshAccessToken();
      }

      const { data } = await axios.post(
        `${API_FULL_URL}/orders`,
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Order created:', data);
      router.push(`/order/${data._id}`);
    } catch (error) {
      console.error('Error creating order', error);
      setError('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((accum, item) => accum + item.price * item.qty, 0);

  return (
    <div>
      <h1>Create New Order</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <h2>Shipping Address</h2>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={shippingAddress.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={shippingAddress.country}
            onChange={handleChange}
            required
          />
        </div>
        <h2>Payment Method</h2>
        <div>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            PayPal
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Stripe
          </label>
        </div>
        {paymentMethod === 'Stripe' && <StripeCheckout amount={totalPrice * 100} />} {/* Stripe amount is in cents */}
        <Button type="submit" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>

      <h2>Order Items</h2>
      {cartItems.length === 0 ? (
        <div>No items in cart</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CreateOrder;