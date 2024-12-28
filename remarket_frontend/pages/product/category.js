import React, { useEffect, useState } from 'react';
import apiService from '../../src/services/apiService';
import Link from 'next/link';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await apiService.getData('products/categories');
        setCategories(categoryData);
      } catch (err) {
        setError(`Error fetching categories: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    try {
      const productData = await apiService.getData(`products?category=${category}`);
      setProducts(productData);
      setSelectedCategory(category);
    } catch (err) {
      setError(`Error fetching products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Product Categories</h1>
      <Link href="/"><a className="btn">Home</a></Link>
      <Link href="/product"><a className="btn">Back to Products</a></Link>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <button onClick={() => fetchProductsByCategory(category)}>{category}</button>
          </li>
        ))}
      </ul>
      {selectedCategory && (
        <div>
          <h2>Products in {selectedCategory}</h2>
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <Link href={`/product/${product._id}`}>
                  <a>{product.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
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

export default CategoryPage;