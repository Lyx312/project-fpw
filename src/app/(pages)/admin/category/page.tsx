'use client'
import React, { useState, useEffect } from 'react';
import { Container, TextField, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

interface Category {
  category_id: number;
  category_name: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  // Fetch categories from the API
  const fetchCategories = async (filterName = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/category?name=${filterName}`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories on initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchCategories(value);
  };
  
  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;

    setLoadingAdd(true);
    try {
      const response = await axios.post('/api/category', { category_name: categoryName });
      setCategoryName(''); // Reset input field
      fetchCategories(); // Refresh categories
      console.log(response.data.message);
    }
     finally {
      setLoadingAdd(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Categories</Typography>
      <TextField
        label="Search Categories"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        sx={{ mb: 4 }}
      />
      <TextField
        label="Category Name"
        fullWidth
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCategory}
        disabled={loadingAdd || !categoryName.trim()}
        sx={{ mb: 4 }}
      >
        {loadingAdd ? 'Adding...' : 'Add Category'}
      </Button>
      {loading ? (
            <Typography>Loading...</Typography>
        ) : categories.length === 0 ? (
            <Typography>No categories found</Typography>
        ) : (
            <List>
                {categories.map((category) => (
                <ListItem key={category.category_id}>
                    <ListItemText primary={category.category_name} />
                </ListItem>
                ))}
            </List>
        )}
    </Container>
  );
};

export default CategoriesPage;