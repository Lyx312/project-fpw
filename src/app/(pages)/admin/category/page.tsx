'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Category {
  category_id: number;
  category_name: string;
}

const colors = {
  primary: '#001F3F',
  secondary: '#3A6D8C',
  accent: '#6A9AB0',
  text: '#EAD8B1',
};

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
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.primary,
        color: colors.text,
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Manage Categories
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text }}>
            Search, add, and manage your categories effortlessly.
          </Typography>
        </Box>

        {/* Search and Add Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: colors.accent,
            borderRadius: '8px',
            mb: 4,
          }}
        >
          <TextField
            label="Search Categories"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            variant="filled"
            InputProps={{
              style: {
                color: colors.primary,
                backgroundColor: colors.secondary,
                borderRadius: '8px',
              },
            }}
            InputLabelProps={{
              style: { color: colors.primary },
            }}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Add Category"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            variant="filled"
            InputProps={{
              style: {
                color: colors.primary,
                backgroundColor: colors.secondary,
                borderRadius: '8px',
              },
            }}
            InputLabelProps={{
              style: { color: colors.primary },
            }}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: colors.secondary,
              color: colors.text,
              '&:hover': { backgroundColor: '#2A5C73' },
            }}
            onClick={handleAddCategory}
            disabled={loadingAdd || !categoryName.trim()}
          >
            {loadingAdd ? 'Adding...' : 'Add Category'}
          </Button>
        </Paper>

        {/* Category List */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: colors.accent,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Categories
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress color="inherit" />
            </Box>
          ) : categories.length === 0 ? (
            <Typography>No categories found</Typography>
          ) : (
            <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {categories.map((category) => (
                <ListItem
                  key={category.category_id}
                  sx={{
                    borderBottom: `1px solid ${colors.primary}`,
                    '&:hover': { backgroundColor: colors.secondary },
                  }}
                >
                  <ListItemText
                    primary={category.category_name}
                    sx={{ color: colors.primary }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CategoriesPage;
