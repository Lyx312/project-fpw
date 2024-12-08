/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Slider, Button, CircularProgress } from "@mui/material";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  description: string;
  price: number;
  categories: string[]; // Updated to handle multiple categories
  postMaker: string;
  createdAt: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [postList, setPostList] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [filters, setFilters] = useState<{
    name: string;
    minPrice: number;
    maxPrice: number;
    category: string;
    status: string;
  }>({
    name: "",
    minPrice: 0,
    maxPrice: 10000000,
    category: "",
    status: "available"
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get<{ data: Category[] }>("/api/category");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch posts based on filters
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ data: Post[] }>("/api/posts", { params: filters });
      setPostList(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const colors = {
    primary: '#001F3F',
    secondary: '#3A6D8C',
    accent: '#6A9AB0',
    text: '#EAD8B1',
  };

  return (
    <div>
      <Header />
      <Box
        sx={{
          backgroundColor: colors.primary,
          color: colors.text,
          minHeight: "100vh",
          padding: 4,
          display: "flex", // Change grid to flex
          flexDirection: "row", // Horizontal layout
          gap: 3,
        }}
      >
        {/* Filter Box */}
        <Box
          sx={{
            backgroundColor: "#003366",
            color: "#fff",
            padding: 3,
            borderRadius: 2,
            width: "300px", // Fixed width
            flexShrink: 0, // Ensure it doesn't shrink
          }}
        >
          <Typography variant="h6" marginBottom={2}>
            Filter Posts
          </Typography>
          <TextField
            fullWidth
            label="Search by Name"
            variant="outlined"
            margin="normal"
            value={filters.name}
            sx={{ color: colors.text }}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
          <Typography>Price Range</Typography>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onChange={(_, newValue) => {
              if (Array.isArray(newValue)) {
                handleFilterChange("minPrice", newValue[0]);
                handleFilterChange("maxPrice", newValue[1]);
              }
            }}
            valueLabelDisplay="auto"
            min={0}
            max={10000000}
          />
          <Typography>Category</Typography>
          <TextField
            select
            fullWidth
            variant="outlined"
            margin="normal"
            SelectProps={{ native: true }}
            value={filters.category}
            sx={{ color: colors.text }}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchPosts}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Apply Filters
          </Button>
        </Box>

        {/* Post Cards */}
        <Box
          sx={{
            flex: 1, // Take remaining space
            display: "flex",
            flexDirection: "column", // Ensure one card per row
            gap: 2,
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : (
            postList.map((item) => (
              <Box
                key={item.id}
                sx={{
                  backgroundColor: "#ffffff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom color="textPrimary">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Posted by: {item.postMaker}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  Price: {item.price.toLocaleString("id-ID")} Token
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Categories:{" "}
                  {item.categories && item.categories.length > 0
                    ? item.categories.join(", ") 
                    : "No categories available"}
                </Typography>
                <Typography variant="body2" color="textSecondary">{item.description}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default Page;
