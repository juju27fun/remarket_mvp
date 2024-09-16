import React, { useEffect, useState } from 'react';
import apiService from '../src/services/apiService';
import { API_FULL_URL } from '../src/utils/constants';
import Link from 'next/link';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getData(`products?pageNumber=${page}`);
        setProducts(response.products);
      } catch (err) {
        setError(`Error fetching products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="hero">
        <h1>Welcome to Remarket</h1>
        <p>Discover our range of products</p>
        <Link href="/categories"><a className="btn">Browse Categories</a></Link>
      </div>
      <div className="features">
        <h2>Featured Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <Link href={`/product/${product._id}`}>
                <a>{product.name}</a>
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={handlePreviousPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
      <Footer />
      <style jsx>{`
        .hero {
          text-align: center;
          padding: 50px 20px;
        }
        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }
        .btn {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
        }
        .features {
          text-align: center;
          padding: 50px 20px;
          background: #f9f9f9;
        }
        .features h2 {
          margin-bottom: 20px;
        }
        .feature-cards {
          display: flex;
          justify-content: space-around;
          margin-top: 30px;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 300px;
        }
        .call-to-action {
          text-align: center;
          padding: 50px 20px;
        }
        .call-to-action h2 {
          margin-bottom: 20px;
        }
        @media (max-width: 768px) {
          .feature-cards {
            flex-direction: column;
            align-items: center;
          }
          .card {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;