/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useRouter } from "next/navigation";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";
import axios from "axios";
import { useAppSelector } from "@/app/redux/hooks";

interface Category {
  _id: string;
  category_id: number;
  category_name: string;
}

interface Country {
  _id: string;
  country_id: number;
  country_name: string;
}

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const router = useRouter();
  const currUser = useAppSelector((state) => state.user);

  const [filters, setFilters] = useState<{
    name: string;
    country: string;
    categories: string[];
  }>({
    name: "",
    country: "",
    categories: [],
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  useEffect(() => {
    fetchCategories();
    fetchCountries();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users", {
        params: {
          role: "freelancer",
          nameOrEmail: filters.name,
          country: filters.country,
          categories: filters.categories.join(","),
        },
      });
      // exclude users with is_approved set to false
      response.data = response.data.filter((user: User) => user.is_approved !== false);
      // exclude users that are not is_email_verified
      response.data = response.data.filter((user: User) => user.is_email_verified !== false);

      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get("/api/country");
      setCountries(response.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const addToList = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
    }
  };

  const removeFromList = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((i) => i !== item));
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
            Filter Freelancers
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
          <FormControl fullWidth margin="normal">
            <InputLabel style={{ color: colors.text }}>Country</InputLabel>
            <Select
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              label="Country"
              sx={{
                color: colors.text,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.text,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.text,
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country._id} value={country.country_id}>
                  {country.country_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            {/* <InputLabel style={{ color: colors.text }}>Categories</InputLabel> */}
            <Select
              value=""
              displayEmpty
              onChange={(e) => {
                addToList(e.target.value as string, filters.categories, (categories) => setFilters(prev => ({ ...prev, categories: categories as string[] })));
              }}
              sx={{
                color: colors.text,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.text,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.text,
                },
              }}
            >
              <MenuItem value="" disabled>
                Select a category
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              {filters.categories.map((category) => (
                <Chip
                  key={category}
                  label={categories.find((cat) => cat._id === category)?.category_name}
                  onDelete={() => removeFromList(category, filters.categories, (categories) => setFilters(prev => ({ ...prev, categories: categories as string[] })))}
                  sx={{ backgroundColor: "#6accf7" }} // Light blue color
                />
              ))}
            </Box>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchUsers}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Apply Filters
          </Button>
        </Box>

        {/* User Cards */}
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
          ) : (
            userList.map((user) => (
              <Box
                key={user._id}
                sx={{
                  backgroundColor: "#ffffff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => router.push(`/profile/${user._id}`)}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                >
                  <Avatar src={user.pfp_path} alt={`${user.first_name} ${user.last_name}`} sx={{ width: 84, height: 84, marginRight: "1rem" }} />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {user.email}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {user.country_name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {user.categories.map(category => category.category_name).join(", ")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: user.status === "Available" ? "green" : "red",
                          marginRight: "0.5rem",
                        }}
                      />
                      <Typography variant="subtitle2" color="text.secondary">
                        {user.status}
                      </Typography>
                    </Box>
                  </Box>
                  {
                    currUser._id && currUser.role === "client" && (
                    <IconButton
                      sx={{ marginLeft: "auto" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/chat/${user._id}`);
                      }}
                    >
                      <ChatIcon />
                      <Typography variant="caption" color="text.secondary" sx={{ marginLeft: "0.5rem" }}>
                        Chat
                      </Typography>
                    </IconButton>
                    )
                  }
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

export default ProfilePage;
