// remarket_frontend/pages/signin.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import { isEmailValid } from '../src/utils/validation';
import apiService from '../src/services/apiService';
import Link from 'next/link';

const SignIn = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
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

    try {
      const data = await apiService.postData('signin', formState);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      router.push('/profile'); // Redirection vers la page Profile après connexion réussie
    } catch (error) {
      setError('Failed to sign in. Check your credentials and try again.');
    }
  };

  return (
    <div className="signin-page">
      <Header />

      <div className="signin-container">
        <h2>Sign In</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Sign In</button>
        </form>
        <div className="links">
          <Link href="/"><a>Home</a></Link>
          <Link href="/register"><a>Don't have an account? Register</a></Link>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .signin-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .signin-container h2 {
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

export default SignIn;