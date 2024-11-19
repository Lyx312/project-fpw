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
import Footer from "@/app/(components)/Footer";
import Header from "@/app/(components)/Header";

const UserProfile = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

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
      <Footer />
    </Box>
  );
};

export default UserProfile;
