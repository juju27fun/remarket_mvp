import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
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

  const handleCreateOrder = async () => {
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
      router.push(`/order/${data._id}`);
    } catch (error) {
      console.error('Error creating order', error);
      setError('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav>
        <Link href="/signin">Signin</Link>
        <Link href="/order">Order Index</Link>
        <Link href="/order/mine">My Orders</Link>
        <Link href="/order/summary">Order Summary</Link>
      </nav>
      <h1>Create Order</h1>
      {error && <p>{error}</p>}
      <form>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={shippingAddress.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={shippingAddress.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={shippingAddress.country}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="PayPal">PayPal</option>
            <option value="Stripe">Stripe</option>
          </select>
        </div>
        <Button onClick={handleCreateOrder} disabled={loading}>
          {loading ? 'Creating Order...' : 'Create Order'}
        </Button>
      </form>
    </div>
  );
};

export default CreateOrder;