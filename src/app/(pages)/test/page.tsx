'use client'
import React, { useEffect, useState } from 'react';
import Loading from '../loading';

// Define Category type instead of Post
type Category = {
  category_id: number;
  category_name: string;
};

const TestPage = () => {
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API route
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/test'); // API endpoint for categories
        const data = await res.json();
        console.log(data);
        setCategories(data); // Update state with the fetched categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false); // Set loading state to false once fetching is done
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Categories</h1>
      {categories.length > 0 ? (
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              <h2>{category.category_name}</h2>
              <small>Category ID: {category.category_id}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories found</p>
      )}
    </div>
  );
};

export default TestPage;