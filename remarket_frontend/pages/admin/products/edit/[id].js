import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../../../src/components/Button'; 
import { getAccessToken, isAuthenticated, refreshAccessToken } from '../../../../src/utils/auth';
import { API_FULL_URL } from '../../../../src/utils/constants'; // Assuming this is the correct path

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    // ... other product fields
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) { 
        setLoading(true);
        try {
          let accessToken = getAccessToken();
          if (!isAuthenticated()) {
            accessToken = await refreshAccessToken();
          }
          const { data } = await axios.get(`${API_FULL_URL}/product/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product data', error);
          setError('Error fetching product data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct(); 
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      let accessToken = getAccessToken();
      if (!isAuthenticated()) {
        accessToken = await refreshAccessToken();
      }
      await axios.put(`${API_FULL_URL}/product/${id}`, product, {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product', error);
      setError('Error updating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        {/* Add other product fields as needed */}
        <Button type="submit">Update Product</Button>
      </form>
    </div>
  );
};

export default EditProduct;