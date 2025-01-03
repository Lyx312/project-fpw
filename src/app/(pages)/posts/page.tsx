/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Button,
  CircularProgress,
  Rating,
} from "@mui/material";
import { useRouter } from "next/navigation"; // Import useRouter
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  description: string;
  price: number;
  categories: string[];
  postMaker: string;
  createdAt: string;
  averageRating: number; // Added averageRating
}

interface Category {
  category_id: number;
  category_name: string;
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [postList, setPostList] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter(); // Initialize the useRouter hook

  const [filters, setFilters] = useState<{
    name: string;
    minPrice: number;
    maxPrice: number;
    category: string;
    status: string;
    minRating: number;
    maxRating: number;
  }>({
    name: "",
    minPrice: 10000,
    maxPrice: 100000000,
    category: "",
    status: "available",
    minRating: 0,
    maxRating: 5,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<{ data: Category[] }>("/api/category");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ data: Post[] }>("/api/posts", {
        params: filters,
      });
      setPostList(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const colors = {
    primary: "#001F3F",
    secondary: "#3A6D8C",
    accent: "#6A9AB0",
    text: "#EAD8B1",
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
          display: "flex",
          flexDirection: "row",
          gap: 3,
        }}
      >
        {/* Filter Box */}
        <Box
          sx={{
            backgroundColor: colors.secondary,
            color: colors.text,
            padding: 3,
            borderRadius: 2,
            width: "300px",
            maxHeight: "calc(100vh - 9rem)",
            flexShrink: 0,
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
            onChange={(e) => handleFilterChange("name", e.target.value)}
            InputLabelProps={{
              style: { color: colors.text },
            }}
            InputProps={{
              style: { color: colors.text, borderColor: colors.text },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.text,
                },
                "&:hover fieldset": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.text,
                },
              },
            }}
          />
          <Typography>Rating Range</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography>{filters.minRating.toFixed(1)}</Typography>
            <Slider
              value={[filters.minRating, filters.maxRating]}
              onChange={(_, newValue) => {
                if (Array.isArray(newValue)) {
                  handleFilterChange(
                    "minRating",
                    parseFloat(newValue[0].toFixed(1))
                  );
                  handleFilterChange(
                    "maxRating",
                    parseFloat(newValue[1].toFixed(1))
                  );
                }
              }}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.1}
              sx={{ flex: 1 }}
            />
            <Typography>{filters.maxRating.toFixed(1)}</Typography>
          </Box>

          <Typography>Price Range</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", Math.max(10000, Math.min(Number(e.target.value), filters.maxPrice)))}
              inputProps={{
                min: 10000,
                max: 100000000,
                step: 1000,
                style: { color: colors.text, borderColor: colors.text }
              }}
              InputLabelProps={{
                style: { color: colors.text },
              }}
              sx={{ width: "130px",
                "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.text,
                },
                "&:hover fieldset": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.text,
                },
              },
            }}
            />
            <Typography>to</Typography>
            <TextField
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", Math.max(filters.minPrice, Math.min(Number(e.target.value), 100000000)))}
              inputProps={{
                min: 10000,
                max: 100000000,
                step: 1000,
                style: { color: colors.text, borderColor: colors.text }
              }}
              InputLabelProps={{
                style: { color: colors.text },
              }}
              sx={{ width: "130px",
                "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.text,
                },
                "&:hover fieldset": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.text,
                },
              },
            }}
            />
          </Box>
          <Typography>Category</Typography>
          <TextField
            select
            fullWidth
            variant="outlined"
            margin="normal"
            SelectProps={{ native: true }}
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            InputLabelProps={{
              style: { color: colors.text },
            }}
            InputProps={{
              style: { color: colors.text, borderColor: colors.text },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.text,
                },
                "&:hover fieldset": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.text,
                },
                "& .MuiSvgIcon-root": {
                  color: colors.text,
                },
              },
            }}
          >
            <option value="" style={{ color: "#000" }}>
              All Categories
            </option>
            {categories.map((cat) => (
              <option
                key={cat.category_id}
                value={cat.category_id}
                style={{ color: "#000" }}
              >
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
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto", 
            maxHeight: "calc(100vh - 6rem)", 
            paddingRight: 2, 
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : postList.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5" sx={{colors:colors.primary}} gutterBottom>
                No posts found.
              </Typography>
              <Typography variant="body1" sx={{colors:colors.primary}}>
                Try adjusting your filters or check back later!
              </Typography>
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
                  cursor: "pointer",
                }}
                onClick={() => router.push(`/posts/detail/${item.id}`)} // Redirect on click
              >
                <Typography variant="h6" gutterBottom color="textPrimary">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Posted by: {item.postMaker}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  Price: Rp. {item.price.toLocaleString("id-ID")},00-
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Categories:{" "}
                  {item.categories.length > 0
                    ? item.categories.join(", ")
                    : "No categories available"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", marginTop: 1 }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginRight: 1 }}
                  >
                    Rating:
                  </Typography>
                  {item.averageRating ? (
                    <Rating
                      value={item.averageRating}
                      precision={0.1}
                      readOnly
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No reviews yet
                    </Typography>
                  )}
                </Box>
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
