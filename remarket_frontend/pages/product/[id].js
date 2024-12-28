import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '../../src/services/apiService';
import Link from 'next/link';

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
          const productData = await apiService.getData(`products/${id}`);
          setProduct(productData);
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
      <Link href="/"><a className="btn">Home</a></Link>
      <Link href="/product"><a className="btn">Back to Products</a></Link>
      <Link href="/product/category"><a className="btn">Browse Categories</a></Link>
      <Link href={`/reviews/${id}`}><a className="btn">View Reviews</a></Link>
      <button onClick={handleAddToCart} className="btn">Add to Cart</button>
      <Link href="/order/create"><a className="btn">Order Now</a></Link>
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

export default ProductDetails;