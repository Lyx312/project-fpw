'use client';

import React from "react";
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
  Container
} from "@mui/material";
import Footer from "@/app/(components)/Footer";
import Header from "@/app/(components)/Header";

const UserProfile = () => {
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
        <Grid container spacing={2} alignItems="center">
          {/* User Info */}
          <Grid item xs={12} md={2}>
            <Avatar
              alt="Andreas Calvin"
              src="/path-to-avatar.jpg"
              sx={{
                width: 80,
                height: 80,
                border: "3px solid #1A2A3A", // border to match theme
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1A2A3A" }}
            >
              Andreas Calvin
            </Typography>
            <Typography variant="body2" color="textSecondary">
              andreascalvin18@gmail.com
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                backgroundColor: "#1A2A3A", // primary color for buttons
                '&:hover': { backgroundColor: "#12304E" },
              }}
            >
              Edit
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              fullWidth
              size="small"
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
              label="Lastest Password"
              fullWidth
              size="small"
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
                label="Password"
                fullWidth
                size="small"
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "6px",
                  input: { color: "#1A2A3A" },
                  "& .MuiInputLabel-root": { color: "#1A2A3A" },
                }}
              />
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#1A2A3A",
                  '&:hover': { backgroundColor: "#12304E" },
                }}
              >
                Change
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel sx={{ color: "#1A2A3A" }}>Gender</InputLabel>
            <Select
              fullWidth
              size="small"
              defaultValue=""
              sx={{
                backgroundColor: "#F5F5F5",
                borderRadius: "6px",
                color: "#1A2A3A",
              }}
            >
              <MenuItem value="">Select Your Gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel sx={{ color: "#1A2A3A" }}>Country</InputLabel>
            <Select
              fullWidth
              size="small"
              defaultValue=""
              sx={{
                backgroundColor: "#F5F5F5",
                borderRadius: "6px",
                color: "#1A2A3A",
              }}
            >
              <MenuItem value="">Choose Your Country</MenuItem>
              <MenuItem value="indonesia">Indonesia</MenuItem>
              <MenuItem value="usa">USA</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Typography variant="subtitle1" sx={{ color: "#1A2A3A" }}>
            My email Address
          </Typography>
          <Typography variant="body2" color="textSecondary">
            andreascalvin18@gmail.com <i>(changed 1 month ago)</i>
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{
              mt: 1,
              borderColor: "#1A2A3A",
              color: "#1A2A3A",
              '&:hover': { borderColor: "#12304E", color: "#12304E" },
            }}
          >
            Change Email Address
          </Button>
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle1" sx={{ color: "#1A2A3A" }}>
            Your Token: 120
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{ color: "#1A2A3A" }}
          >
            Buy Token?
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default UserProfile;
