// remarket_frontend/pages/register.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { API_FULL_URL } from '../src/utils/constants';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import { isEmailValid, isPasswordStrong } from '../src/utils/validation';

const Register = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid(formState.email)) {
      setError('Invalid email format.');
      return;
    }
    if (!isPasswordStrong(formState.password)) {
      setError('Password must be at least 8 characters long and include letters and digits.');
      return;
    }

    try {
      const response = await axios.post(`${API_FULL_URL}/users/register`, formState);
      const data = response.data;

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Redirection après inscription réussie
      router.push('/profile'); // Vous pouvez changer vers '/signin' ou '/' selon vos besoins
    } catch (error) {
      console.error('Registration Error:', error);
      setError('Failed to register. Please check your inputs and try again.');
    }
  };

  return (
    <div className="register-page">
      <Header />

      <div className="register-container">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <div className="links">
          <Link href="/"><a>Home</a></Link>
          <Link href="/signin"><a>Already have an account? Sign In</a></Link>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .register-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .register-container h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          width: 100%;
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 10px;
        }
        .links {
          text-align: center;
          margin-top: 20px;
        }
        .links a {
          margin: 0 10px;
          color: #0070f3;
          text-decoration: none;
        }
        .links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Register;