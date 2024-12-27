// remarket_frontend/pages/profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { API_FULL_URL } from '../src/utils/constants';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import { isEmailValid, isPasswordStrong } from '../src/utils/validation';

const Profile = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    sellerName: '',
    sellerLogo: '',
    sellerDescription: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('No access token found, please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_FULL_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setProfileData(response.data);
        setFormState({
          name: response.data.name,
          email: response.data.email,
          sellerName: response.data.isSeller ? response.data.seller.name : '',
          sellerLogo: response.data.isSeller ? response.data.seller.logo : '',
          sellerDescription: response.data.isSeller ? response.data.seller.description : '',
        });
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch profile. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    if (formState.password && !isPasswordStrong(formState.password)) {
      setError('Password must be at least 8 characters long and include letters and digits.');
      return;
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${API_FULL_URL}/users/profile`,
        formState,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update token in local storage if provided in response
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }

      setLoading(false);
      router.reload();
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-container">
        <h2>Profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
            />
          </div>
          {profileData && profileData.isSeller && (
            <>
              <div>
                <label>Seller Name</label>
                <input
                  type="text"
                  name="sellerName"
                  value={formState.sellerName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Seller Logo</label>
                <input
                  type="text"
                  name="sellerLogo"
                  value={formState.sellerLogo}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Seller Description</label>
                <input
                  type="text"
                  name="sellerDescription"
                  value={formState.sellerDescription}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <button type="submit">Update Profile</button>
        </form>
      </div>

      <Footer />

      <style jsx>{`
        .profile-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .profile-container h2 {
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
      `}</style>
    </div>
  );
};

export default Profile;