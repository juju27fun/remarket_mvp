import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_FULL_URL } from '../../src/utils/constants';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_FULL_URL}/products/categories`);
        setCategories(response.data);
      } catch (err) {
        setError(`Error fetching categories: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <Link href={`/product/category/${category}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;