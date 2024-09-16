import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_FULL_URL } from '../src/utils/constants';  // Adjust the path as necessary

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_FULL_URL}/signin`, {
        email,
        password,
      });
      const data = response.data;
      // Assuming tokens or user data are returned and need to be stored
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      // Redirect to the homepage or user dashboard after successful sign-in
      router.push('/');
    } catch (error) {
      setError('Failed to sign in. Check your credentials and try again.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;