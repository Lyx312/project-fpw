"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Avatar,
  Grid,
  Container,
  SelectChangeEvent,
  Chip,
  FormControl,
} from "@mui/material";
import Footer from "@/app/(components)/Footer";
import Header from "@/app/(components)/Header";
import axios from "axios";
import { ICategory } from "@/models/categoryModel";
import { ICountry } from "@/models/countryModel";
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { clearUser } from '@/app/redux/slices/userSlice';
import { baseUrl } from "@/config/url";

const UserProfile = () => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    old_password: "",
    new_password: "",
    confirm_password: "",
    gender: " ",
    country_id: "",
    phone: "",
    pfp_path: "",
    file: null as File | null,
    categories: [] as string[],
    status: "",
  });
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const currUser = useAppSelector((state) => state.user);

  const fetchUser = async () => {
    if (currUser._id) {
      setFormData({
        first_name: currUser.first_name as string,
        last_name: currUser.last_name as string,
        old_password: "",
        new_password: "",
        confirm_password: "",
        gender: currUser.gender as string,
        country_id: currUser.country_id as string,
        phone: currUser.phone as string,
        pfp_path: currUser.pfp_path as string,
        categories: currUser.categories as string[],
        file: null,
        status: currUser.status as string,
      });
    } else {
      console.log("No user found");
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/country`
      );
      setCountries(response.data.data);
      // console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/category`
      );
      setAllCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCountries();
    fetchCategories();
  }, [currUser]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | { name?: string; value: unknown };
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setFormData({
        ...formData,
        file: file,
      });
      console.log("Selected file:", file);
    }
  };

  const handleEditProfilePictureClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) =>
      handleProfilePictureChange(
        e as unknown as React.ChangeEvent<HTMLInputElement>
      );
    fileInput.click();
  };

  const addToList = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
    }
  };

  const removeFromList = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((i) => i !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData);
      console.log(currUser);

      const { file, ...dataToSubmit } = formData;

      if (file) {
        const formData = new FormData();
        formData.append("file", file as Blob, `/pfp/${currUser?.email}.png`);
        formData.append("type", "pfp");

        const uploadResponse = await axios.post(
          `${baseUrl}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        dataToSubmit.pfp_path = uploadResponse.data.blob.url;
      }

      const response = await axios.put(
        `${baseUrl}/api/users/${currUser?._id}`,
        dataToSubmit
      );
      console.log("Profile updated:", response.data);
      alert("Profile updated successfully");
      dispatch(clearUser());
      fetchUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      const err = error as axios.AxiosError;
      alert(
        `Error updating profile: ${
          (err.response?.data as { message?: string })?.message || err.message
        }`
      );
    }
  };

  return (
    <Box sx={{ backgroundColor: "#1A2A3A", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container
        sx={{
          maxWidth: "800px",
          margin: "20px auto",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            {/* User Info */}
            <Grid item xs={12} md={2}>
              <Avatar
                alt="avatar"
                src={`${currUser?.pfp_path || ""}`}
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid #1A2A3A",
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {selectedFileName && (
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Selected file: {selectedFileName}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  backgroundColor: "#1A2A3A",
                  "&:hover": { backgroundColor: "#12304E" },
                  mt: 1,
                  ml: -1, // Added margin-left to move button slightly left
                }}
                onClick={handleEditProfilePictureClick}
              >
                Edit Profile Picture
              </Button>
            </Grid>
            <Grid item xs={12} md={6} textAlign="left">
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1A2A3A" }}
              >
                {currUser?.first_name} {currUser?.last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {currUser?.email}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                fullWidth
                size="small"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleInputChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "6px",
                  input: { color: "#1A2A3A" },
                  "& .MuiInputLabel-root": { color: "#1A2A3A" },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                fullWidth
                size="small"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleInputChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "6px",
                  input: { color: "#1A2A3A" },
                  "& .MuiInputLabel-root": { color: "#1A2A3A" },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                fullWidth
                size="small"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "6px",
                  input: { color: "#1A2A3A" },
                  "& .MuiInputLabel-root": { color: "#1A2A3A" },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Old Password"
                fullWidth
                size="small"
                name="old_password"
                type="password"
                value={formData.old_password || ""}
                onChange={handleInputChange}
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "6px",
                  input: { color: "#1A2A3A" },
                  "& .MuiInputLabel-root": { color: "#1A2A3A" },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  label="New Password"
                  fullWidth
                  size="small"
                  name="new_password"
                  type="password"
                  value={formData.new_password || ""}
                  onChange={handleInputChange}
                  sx={{
                    backgroundColor: "#F5F5F5",
                    borderRadius: "6px",
                    input: { color: "#1A2A3A" },
                    "& .MuiInputLabel-root": { color: "#1A2A3A" },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  label="Confirm New Password"
                  fullWidth
                  size="small"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password || ""}
                  onChange={handleInputChange}
                  sx={{
                    backgroundColor: "#F5F5F5",
                    borderRadius: "6px",
                    input: { color: "#1A2A3A" },
                    "& .MuiInputLabel-root": { color: "#1A2A3A" },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ color: "#1A2A3A" }}>Gender</InputLabel>
              <Select
                fullWidth
                size="small"
                name="gender"
                value={formData.gender || " "}
                onChange={handleInputChange}
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "6px",
                  color: "#1A2A3A",
                }}
              >
                <MenuItem value=" " disabled>
                  Select Your Gender
                </MenuItem>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ color: "#1A2A3A" }}>Country</InputLabel>
              <Select
                fullWidth
                size="small"
                name="country_id"
                value={formData.country_id || ""}
                onChange={handleInputChange}
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "6px",
                  color: "#1A2A3A",
                }}
              >
                <MenuItem value="">Choose Your Country</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.country_id} value={country.country_id}>
                    {country.country_name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          {currUser?.role === "freelancer" && (
            <>
              <Grid item xs={12} md={6} mt={2}>
                <InputLabel sx={{ color: "#1A2A3A" }}>Status</InputLabel>
                <Select
                  fullWidth
                  size="small"
                  name="status"
                  value={formData.status || " "}
                  onChange={handleInputChange}
                  sx={{
                    backgroundColor: "#F5F5F5",
                    borderRadius: "6px",
                    color: "#1A2A3A",
                  }}
                >
                  <MenuItem value=" " disabled>
                    Select Your Status
                  </MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Away">Away</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} md={6} mt={2}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: "#1A2A3A" }}>
                    Categories
                  </Typography>
                  <Select
                    value=""
                    displayEmpty
                    onChange={(e) => {
                      addToList(e.target.value as string, formData.categories, (categories) => setFormData(prev => ({ ...prev, categories: categories as string[] })));
                    }}
                    sx={{
                      backgroundColor: "#F5F5F5",
                      borderRadius: "6px",
                      color: "#1A2A3A",
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
                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                    {formData.categories.map((category) => (
                      <Chip
                      key={category}
                      label={allCategories.find((cat) => cat._id === category)?.category_name}
                      onDelete={() => removeFromList(category, formData.categories, (categories) => setFormData(prev => ({ ...prev, categories: categories as string[] })))}
                      sx={{ backgroundColor: "#6accf7" }} // Light blue color
                      />
                    ))}
                    </Box>
                </FormControl>
              </Grid>
            </>
          )}

          <Box mt={2} textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#1A2A3A",
                "&:hover": { backgroundColor: "#12304E" },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default UserProfile;
