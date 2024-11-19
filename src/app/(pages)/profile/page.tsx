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
} from "@mui/material";

const UserProfile = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#6699CC",
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff" }}>
          LOGO
        </Typography>
        <Box>
          <TextField
            size="small"
            placeholder="Search"
            sx={{ backgroundColor: "#fff", borderRadius: 1, marginRight: 2 }}
          />
          {/* Dummy icons */}
          <span role="img" aria-label="cart">
            🛒
          </span>
          <span role="img" aria-label="question">
            ❓
          </span>
          <span role="img" aria-label="notification">
            🔔
          </span>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "800px",
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* User Info */}
          <Grid item xs={12} md={2}>
            <Avatar
              alt="Andreas Calvin"
              src="/path-to-avatar.jpg"
              sx={{ width: 64, height: 64 }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6">Andreas Calvin</Typography>
            <Typography variant="body2" color="textSecondary">
              andreascalvin18@gmail.com
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="contained" color="warning" size="small">
              Edit
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <TextField label="First Name" fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Last Name" fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Lastest Password" fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField label="Password" fullWidth size="small" />
              <Button variant="contained" size="small">
                Change
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>Gender</InputLabel>
            <Select fullWidth size="small" defaultValue="">
              <MenuItem value="">Select Your Gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>Country</InputLabel>
            <Select fullWidth size="small" defaultValue="">
              <MenuItem value="">Choose Your Country</MenuItem>
              <MenuItem value="indonesia">Indonesia</MenuItem>
              <MenuItem value="usa">USA</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Typography variant="subtitle1">My email Address</Typography>
          <Typography variant="body2" color="textSecondary">
            andreascalvin18@gmail.com <i>(changed 1 month ago)</i>
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }}>
            Change Email Address
          </Button>
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle1">Your Token: 120</Typography>
          <Button variant="text" size="small">
            Buy Token?
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{ backgroundColor: "#6699CC", color: "#fff", padding: 2, mt: 4 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1">Help & Supports</Typography>
            <Typography variant="body2">International</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1">Category</Typography>
            <Typography variant="body2">Categories</Typography>
            <Typography variant="body2">Projects</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1">About</Typography>
            <Typography variant="body2">How it Works</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1">Terms</Typography>
            <Typography variant="body2">Privacy Policy</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" mt={2}>
          Copyright © 2024 (Nama Team)
        </Typography>
      </Box>
    </Box>
  );
};

export default UserProfile;
