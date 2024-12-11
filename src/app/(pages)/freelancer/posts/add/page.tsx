/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  Chip,
  Box,
  FormControl,
} from "@mui/material";
import { getCurrUser } from "@/utils/utils";
import axios from "axios";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  exp: number;
}

const AddPostPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currUser, setCurrUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrUser();
        if (user) {
          setCurrUser(user as any);
        }
      } catch (error) {
        console.error("Error fetching user or posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();
        if (response.ok) {
          setAllCategories(data.data); // Assuming response contains data field
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/posts", {
        title,
        description,
        price,
        email: currUser?.email,
        categories,
      });

      if (response.status === 200) {
        router.push("/freelancer/posts");
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to list
  const addToList = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
    }
  };

  // Remove item from list
  const removeFromList = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((i) => i !== item));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add New Post
      </Typography>
      <Grid container spacing={2}>
        {/* Title Field */}
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>

        {/* Description Field */}
        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>

        {/* Price Field */}
        <Grid item xs={12}>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </Grid>

        {/* Categories Selection */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Categories
          </Typography>
          <FormControl fullWidth>
            <Select
              value=""
              displayEmpty
              onChange={(e) => {
                addToList(e.target.value as string, categories, setCategories);
              }}
            >
              <MenuItem value="" disabled>
                Select a category
              </MenuItem>
              {allCategories.map((cat) => (
                <MenuItem key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={
                  allCategories.find((cat) => cat.category_id === category)
                    ?.category_name
                }
                onDelete={() => removeFromList(category, categories, setCategories)}
              />
            ))}
          </Box>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddPostPage;
