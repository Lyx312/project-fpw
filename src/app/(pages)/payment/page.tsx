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
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Header />

      {/* Content */}
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 1,
            p: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Buy Tokens
          </Typography>
          <Button variant="text" sx={{ color: "#000", mb: 2 }}>
            Cancel
          </Button>
          <Typography variant="body1" gutterBottom>
            Select Payment Method
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            defaultValue=""
            variant="outlined"
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Choose Your Payment
            </MenuItem>
            <MenuItem value="credit_card">Credit Card</MenuItem>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
          </TextField>
          <Typography variant="body1" gutterBottom>
            Subtotal
          </Typography>
          <Typography variant="h6" gutterBottom>
            Rp 30.000
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary">
              Payment
            </Button>
            <Button variant="outlined" color="primary">
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
