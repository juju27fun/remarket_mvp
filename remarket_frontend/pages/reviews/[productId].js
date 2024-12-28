import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '../../src/services/apiService';
import Link from 'next/link';

const ReviewsPage = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (productId) {
      const fetchProductAndReviews = async () => {
        try {
          const productData = await apiService.getData(`products/${productId}`);
          const reviewsData = await apiService.getData(`reviews/${productId}`);
          setProduct(productData);
          setReviews(reviewsData);
        } catch (err) {
          setError('Error fetching product details or reviews');
        } finally {
          setLoading(false);
        }
      };
      fetchProductAndReviews();
    }
  }, [productId]);

  const handleAddReview = async () => {
    try {
      await apiService.postData(`reviews/${productId}`, { review: newReview, rating });
      alert('Review added');
      setNewReview('');
      setRating(0);
    } catch (err) {
      alert(`Error adding review: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>Reviews for {product.name}</h1>
      <Link href="/"><a className="btn">Home</a></Link>
      <Link href="/product"><a className="btn">Back to Products</a></Link>
      <Link href={`/product/${productId}`}><a className="btn">Back to Product</a></Link>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>
            <p>{review.review}</p>
            <p>Rating: {review.rating} / 5</p>
          </li>
        ))}
      </ul>
      <div>
        <h2>Add a Review</h2>
        <textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} />
        <div>
          <label>Rating: </label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={0}>Select</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <button onClick={handleAddReview} className="btn">Submit Review</button>
      </div>
      <style jsx>{`
        .btn {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin: 5px;
        }
      `}</style>
    </div>
  );
};

export default ReviewsPage;