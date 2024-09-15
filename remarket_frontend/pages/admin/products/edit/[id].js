import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic product ID from the URL
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    // ... other product fields
  });

  useEffect(() => {
    // Fetch product data when the component is mounted
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/v1/product/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product data', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/product/${id}`, product);
      router.push('/admin/products'); // Redirect to the products list page
    } catch (error) {
      console.error('Error updating product', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} />
      </div>
      <div>
        <label>Price</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} />
      </div>
      <div>
        <label>Description</label>
        <textarea name="description" value={product.description} onChange={handleChange}></textarea>
      </div>
      {/* Add other product fields as needed */}
      <button type="submit">Update Product</button>
    </form>
  );
};

export default EditProduct;