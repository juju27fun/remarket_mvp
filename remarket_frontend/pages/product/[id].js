import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '../../src/services/apiService';
import Link from 'next/link';
import axios from 'axios';
import { API_FULL_URL } from '../../src/utils/constants';

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
          setError(`Error fetching product details: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await apiService.postData('order/create', { productId: id });
      alert('Product added to cart');
    } catch (err) {
      alert(`Error adding product to cart: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <Link href="/">Back to products</Link>
    </div>
  );
};

export default ProductDetails;