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
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

interface Category {
  category_id: string;
  category_name: string;
}

interface Post {
  title: string;
  description: string;
  price: number;
  categories: string[];
  categories_id: string[];
}

const EditPostPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndCategories = async () => {
      try {
        setLoading(true);

        // Fetch post and categories in parallel
        const [postResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch("/api/category"),
        ]);

        const postData = await postResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (postResponse.ok && categoriesResponse.ok) {
          setPost(postData);
          setCategories(postData.categories_id || []);
          setAllCategories(categoriesData.data || []);
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

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setCategories((prev) =>
      checked
        ? [...prev, categoryId]
        : prev.filter((cat) => cat !== categoryId)
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...post,
          categories,
        }),
      });

      if (response.ok) {
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
        <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
                Categories
            </Typography>
            {allCategories.map((cat) => (
                <FormControlLabel
                key={cat.category_id}
                control={
                    <Checkbox
                    value={cat.category_id}
                    checked={categories.includes(cat.category_id)}
                    onChange={(e) =>
                        handleCategoryChange(cat.category_id, e.target.checked)
                    }
                    />
                }
                label={cat.category_name}
                />
            ))}
            </Grid>
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
