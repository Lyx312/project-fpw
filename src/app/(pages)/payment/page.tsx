'use client';

import React from "react";
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Container,
} from "@mui/material";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";

const BuyTokensPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#1A2A3A" }}>
      {/* Header */}
      <Header />

      {/* Content */}
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Box
          sx={{
            border: "1px solid #4B6CB7",
            borderRadius: 1,
            p: 3,
            backgroundColor: "#2E3C55", // Dark blue background
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // Efek bayangan untuk kedalaman
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom sx={{ color: "#ffffff", fontWeight: "bold" }}>
            Buy Tokens
          </Typography>

          {/* Cancel Button */}
          <Button
            variant="text"
            sx={{ color: "#4B6CB7", mb: 2, textTransform: "none", '&:hover': { color: "#3A5B8D" } }}
          >
            Cancel
          </Button>

          {/* Select Payment Method */}
          <Typography variant="body1" gutterBottom sx={{ color: "#FFFFFF" }}>
            Select Payment Method
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            defaultValue=""
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: "#F5F5F5",
              borderRadius: "8px",
              "& .MuiInputLabel-root": { color: "#1A2A3A" },
              "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#4B6CB7" } },
              "&:hover .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#3A5B8D" } },
            }}
          >
            <MenuItem value="" disabled>
              Choose Your Payment
            </MenuItem>
            <MenuItem value="credit_card">Credit Card</MenuItem>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
          </TextField>

          {/* Subtotal */}
          <Typography variant="body1" gutterBottom sx={{ color: "#FFFFFF" }}>
            Subtotal
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: "#F5F5F5" }}>
            Rp 30.000
          </Typography>

          {/* Payment and Cancel Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#4B6CB7",
                '&:hover': { backgroundColor: "#3A5B8D" },
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                color: "#FFFFFF",
              }}
            >
              Payment
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                borderColor: "#4B6CB7",
                color: "#4B6CB7",
                '&:hover': { borderColor: "#3A5B8D", color: "#3A5B8D" },
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default BuyTokensPage;
