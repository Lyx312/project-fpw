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
  Alert,
  Snackbar,
} from "@mui/material";
import { getCurrUser } from "@/utils/utils";
import axios from "axios";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";
import { ICategory } from "@/models/categoryModel";

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
  const [price, setPrice] = useState<number | "">("");
  const [categories, setCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [currUser, setCurrUser] = useState<User | null>(null);
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrUser();
        if (user) {
          setCurrUser(user as unknown as User);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();
        if (response.ok) {
          setAllCategories(data.data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setAlert({ open: true, message: "Title is required." });
      return;
    }
    if (!description.trim()) {
      setAlert({ open: true, message: "Description is required." });
      return;
    }
    if (price === "" || price < 10000 || price > 100000000) {
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
        setAlert({ open: true, message: "Failed to create post." });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        open: true,
        message: "An error occurred while creating the post.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToList = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
    }
  };

  const removeFromList = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((i) => i !== item));
  };

  return (
    <>
      <Box sx={{ backgroundColor: colors.primary, minHeight: "100vh"}}>
        <Header />
        <Container
          maxWidth="sm"
          sx={{
            padding: "2rem",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            marginTop: "2rem",
            marginBottom: "2rem"
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#333", fontWeight: "bold", textAlign: "center" }}
          >
            Add New Post
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#555",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#888",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#555",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#888",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#555",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#888",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "#333", fontWeight: "bold" }}
              >
                Categories
              </Typography>
              <FormControl fullWidth>
                <Select
                  value=""
                  displayEmpty
                  onChange={(e) => {
                    addToList(
                      e.target.value as string,
                      categories,
                      setCategories
                    );
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#ccc",
                      borderRadius: "8px",
                    },
                    "&:hover .MuiOutlinedInput-root": {
                      borderColor: "#888",
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
                    key={category}
                    label={
                      allCategories.find(
                        (cat) => cat._id === category
                      )?.category_name
                    }
                    onDelete={() =>
                      removeFromList(category, categories, setCategories)
                    }
                    sx={{
                      backgroundColor: "#4b6cb7",
                      color: "white",
                      "&:hover": { backgroundColor: "#3a5b8d" },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "#4b6cb7",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#3a5b8d",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
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

export default AddPostPage;
