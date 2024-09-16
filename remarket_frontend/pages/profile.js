import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { API_FULL_URL } from '../src/utils/constants';  // Adjust the path as necessary

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
    sellerDescription: ''
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

        const response = await axios.get(`${API_FULL_URL}/api/v1/users/profile`, {
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
          sellerDescription: response.data.isSeller ? response.data.seller.description : ''
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
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${API_FULL_URL}/api/v1/users/profile`, 
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
        {profileData.isSeller && (
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
  );
};

export default Profile;