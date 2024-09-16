import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_FULL_URL } from '../../src/utils/constants';
import { formatDate } from '../../src/utils/format';
import {
  getAccessToken,
  isAuthenticated,
  refreshAccessToken
} from '../../src/utils/auth';

const OrderSummary = () => {
  const [summary, setSummary] = useState({
    users: [],
    orders: [],
    dailyOrders: [],
    productCategories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Total Users</h2>
      <p>{summary.users[0]?.numUsers ?? 0}</p>

      <h2>Total Orders</h2>
      <p>{summary.orders[0]?.numOrders ?? 0}</p>

      <h2>Total Sales</h2>
      <p>${summary.orders[0]?.totalSales?.toFixed(2) ?? 0.00}</p>

      <h2>Daily Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Orders</th>
            <th>Sales</th>
          </tr>
        </thead>
        <tbody>
          {summary.dailyOrders.map(day => (
            <tr key={day._id}>
              <td>{formatDate(day._id)}</td>
              <td>{day.orders}</td>
              <td>${day.sales.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Product Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {summary.productCategories.map(category => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>{category.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderSummary;