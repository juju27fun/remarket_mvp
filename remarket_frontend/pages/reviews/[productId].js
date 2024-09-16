import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_FULL_URL } from '../../src/utils/constant';
import { useRouter } from 'next/router';

const ProductDetails = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`${API_FULL_URL}/products/${productId}`);
          setProduct(data);
        } catch (err) {
          setError('Error fetching product details');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img
        src={`${API_BASE_URL}/uploads/${product.image}`} 
        alt={`${product.name} image`}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Brand: {product.brand}</p>
      <p>State: {product.state}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.countInStock}</p>
      <p>Rating: {product.rating}</p>
      <p>Reviews: {product.numReviews}</p>
      {/* Render the reviews */}
      <div>
        <h2>Reviews</h2>
        {product.reviews?.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index}>
              <strong>{review.name}</strong>
              <p>Rating: {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;