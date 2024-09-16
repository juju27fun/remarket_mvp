import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_FULL_URL } from '../../src/utils/constant';
import { useRouter } from 'next/router';

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`${API_FULL_URL}/products/${id}`);
          setProduct(response.data);
        } catch (err) {
          setError('Error fetching product details');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.category}</p>
      <p>Price: {product.price}</p>
      {/* Add more product details as needed */}
    </div>
  );
};

export default ProductDetails;