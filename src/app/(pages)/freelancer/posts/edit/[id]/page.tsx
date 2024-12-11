/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  InputLabel,
} from "@mui/material";
import axios from "axios";

interface Category {
  category_id: string;
  category_name: string;
}

interface Post {
  title: string;
  description: string;
  price: number;
  categories: string[];
  post_status: string;
}

const EditPostPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [postStatus, setPostStatus] = useState<string>("available");

  // Add item to list
  const addToList = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
    }
  };

  // Remove item from list
  const removeFromList = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((i) => i !== item));
  };

  useEffect(() => {
    const fetchPostAndCategories = async () => {
      try {
        setLoading(true);

        // Fetch post and categories in parallel using axios
        const [postResponse, categoriesResponse] = await Promise.all([
          axios.get(`/api/posts/${id}`),
          axios.get("/api/category"),
        ]);

        const postData = postResponse.data;
        const categoriesData = categoriesResponse.data;

        if (postResponse.status === 200 && categoriesResponse.status === 200) {
          setPost(postData);
          setCategories(postData.categories_id || []);
          setAllCategories(categoriesData.data || []);
          setPostStatus(postData.status || "available");
          console.log(postData);
          
        } else {
          console.error("Failed to fetch post or categories");
        }
      } catch (error) {
        console.error("Error fetching post or categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostAndCategories();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/posts/${id}`, {
        ...post,
        categories,
        status: postStatus,
      });
      console.log("update");
      
      if (response.status === 200) {
        router.push("/freelancer/posts");
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!post) return <Typography variant="h6">Post not found</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Post
      </Typography>
      <Grid container spacing={2}>
        {/* Title Field */}
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            value={post.title}
            onChange={(e) =>
              setPost((prev) => (prev ? { ...prev, title: e.target.value } : null))
            }
          />
        </Grid>

        {/* Description Field */}
        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={post.description}
            onChange={(e) =>
              setPost((prev) =>
                prev ? { ...prev, description: e.target.value } : null
              )
            }
          />
        </Grid>

        {/* Price Field */}
        <Grid item xs={12}>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={post.price}
            onChange={(e) =>
              setPost((prev) =>
                prev ? { ...prev, price: Number(e.target.value) } : null
              )
            }
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

        {/* Post Status Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="post-status-label">Post Status</InputLabel>
            <Select
              labelId="post-status-label"
              label="Post Status"
              value={postStatus}
              onChange={(e) => setPostStatus(e.target.value as string)}
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Update Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditPostPage;
