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
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import Loading from "@/app/(pages)/loading";
import Footer from "@/app/(components)/Footer";
import Header from "@/app/(components)/Header";
import { ICategory } from "@/models/categoryModel";

interface Post {
  title: string;
  description: string;
  price: number;
  categories: ICategory[];
  post_status: string;
}

const EditPostPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [postStatus, setPostStatus] = useState<string>("available");
  const [alert, setAlert] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const colors = {
    primary: "#001F3F",
    secondary: "#3A6D8C",
    accent: "#6A9AB0",
    text: "#EAD8B1",
  };

  // Add item to list
  const addToList = (
    item: ICategory,
    list: ICategory[],
    setList: React.Dispatch<React.SetStateAction<ICategory[]>>
  ) => {
    if (item && !list.some((i) => i._id === item._id)) {
      setList([...list, item]);
    }
  };

  // Remove item from list
  const removeFromList = (
    item: ICategory,
    list: ICategory[],
    setList: React.Dispatch<React.SetStateAction<ICategory[]>>
  ) => {
    setList(list.filter((i) => i._id !== item._id));
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
          setCategories(postData.categories || []);
          setAllCategories(categoriesData.data || []);
          setPostStatus(postData.status || "available");
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
    if (!post?.title.trim()) {
      setAlert({ open: true, message: "Title is required." });
      return;
    }
    if (!post?.description.trim()) {
      setAlert({ open: true, message: "Description is required." });
      return;
    }
    if (post.price === undefined || post.price < 10000 || post.price > 100000000) {
      setAlert({ open: true, message: "Price must be between Rp. 10.000 and Rp. 100.000.000." });
      return;
    }
    if (categories.length === 0) {
      setAlert({
        open: true,
        message: "At least one category must be selected.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`/api/posts/${id}`, {
        ...post,
        categories,
        status: postStatus,
      });

      if (response.status === 200) {
        router.push("/freelancer/posts");
      } else {
        setAlert({ open: true, message: "Failed to update post." });
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setAlert({
        open: true,
        message: "An error occurred while updating the post.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!post) return <Typography variant="h6">Post not found</Typography>;

  return (
    <>
      <Box sx={{ backgroundColor: colors.primary, minHeight: "100vh"}}>
        <Header />
        <Container maxWidth="sm"
            sx={{
              padding: "2rem",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              marginTop: "2rem",
              marginBottom: "2rem"
            }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#4B6CB7", fontWeight: "bold" }}
          >
            Edit Post
          </Typography>
          <Grid container spacing={3}>
            {/* Title Field */}
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={post.title}
                onChange={(e) =>
                  setPost((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#4B6CB7",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#4B6CB7",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3A5B8D",
                    },
                  },
                }}
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
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#4B6CB7",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#4B6CB7",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3A5B8D",
                    },
                  },
                }}
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
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#4B6CB7",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#4B6CB7",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3A5B8D",
                    },
                  },
                }}
              />
            </Grid>

            {/* Categories Selection */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "#4B6CB7" }}
              >
                Categories
              </Typography>
              <FormControl fullWidth>
                <Select
                  value=""
                  displayEmpty
                  onChange={(e) => {
                    const selectedCategory = allCategories.find(
                      (cat) => cat._id === e.target.value
                    );
                    if (selectedCategory) {
                      addToList(selectedCategory, categories, setCategories);
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#4B6CB7",
                      borderRadius: "8px",
                    },
                    "&:hover .MuiOutlinedInput-root": {
                      borderColor: "#3A5B8D",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {allCategories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                {categories.map((category) => (
                  <Chip
                    key={category._id}
                    label={category.category_name}
                    onDelete={() =>
                      removeFromList(category, categories, setCategories)
                    }
                    sx={{
                      backgroundColor: "#4B6CB7",
                      color: "white",
                      "&:hover": { backgroundColor: "#3A5B8D" },
                    }}
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
                sx={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "#4B6CB7",
                  "&:hover": {
                    backgroundColor: "#3A5B8D",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </Grid>
          </Grid>
          <Snackbar
            open={alert.open}
            autoHideDuration={4000}
            onClose={() => setAlert({ open: false, message: "" })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="error"
              onClose={() => setAlert({ open: false, message: "" })}
            >
              {alert.message}
            </Alert>
          </Snackbar>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default EditPostPage;
