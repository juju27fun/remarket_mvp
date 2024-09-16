import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_FULL_URL } from '../../src/utils/constants';
import Button from '../../src/components/Button';

const CreateUser = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
    isSeller: false,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    value = type === 'checkbox' ? checked : value;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_FULL_URL}/register`, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      console.log('User created:', data);
      router.push('/admin/users'); // Redirect to the users list page
    } catch (error) {
      setError('Error creating user. Please check your inputs and try again.');
      console.error('Error creating user', error);
    }
  };

  return (
    <div>
      <h1>Create New User</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={user.isAdmin}
              onChange={handleChange}
            />
            Admin
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isSeller"
              checked={user.isSeller}
              onChange={handleChange}
            />
            Seller
          </label>
        </div>
        <Button type="submit">Create User</Button>
      </form>
    </div>
  );
};

export default CreateUser;