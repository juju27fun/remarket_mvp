import React, { useEffect, useState } from 'react';
import apiService from '../../src/services/apiService';
import Link from 'next/link';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';

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
        <Link href="/" className="btn">Home</Link>
        <Link href="/profile" className="btn">Profile</Link>
        <Link href="/product/category" className="btn">Browse Categories</Link>
      </div>
      <div className="features">
        <h2>Featured Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <Link href={`/product/${product._id}`}>
                {product.name}
              </Link>
              <Link href={`/product/${product._id}`}
                 className="btn">View Details
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
        }
        .btn {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin: 5px;
        }
        .features {
          text-align: center;
          padding: 50px 20px;
        }
        .features h2 {
          margin-bottom: 20px;
        }
        .features ul {
          list-style: none;
          padding: 0;
        }
        .features li {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default HomePage;