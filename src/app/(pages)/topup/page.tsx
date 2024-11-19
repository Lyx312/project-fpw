"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Link,
} from "@mui/material";
import Footer from "@/app/(components)/Footer";
import Header from "@/app/(components)/Header";

export default function BuyTokens() {
  const [tokenToBuy, setTokenToBuy] = useState<number>(20);
  const availableTokens = 120;

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setTokenToBuy(value > 0 ? value : 0);
  };

  return (
    <div>
      <Header />
      <Container maxWidth="md">
        {/* Header */}

        {/* Main Content */}
        <Paper elevation={3} sx={{ p: 4, mt: 2, borderRadius: 2 }}>
          <Typography variant="body1" gutterBottom>
            Your available tokens:{" "}
            <Typography component="span" fontWeight="bold">
              {availableTokens}
            </Typography>
          </Typography>

          <TextField
            fullWidth
            type="number"
            label="Insert token to buy"
            value={tokenToBuy}
            onChange={handleTokenChange}
            sx={{ my: 2 }}
          />

          <Typography variant="body1" gutterBottom>
            Your token balance will be:{" "}
            <Typography component="span" fontWeight="bold">
              {availableTokens + tokenToBuy}
            </Typography>
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            This bundle of Tokens will expire 1 year from today. Unused Tokens
            rollover to the next month.{" "}
            <Link href="#" underline="hover">
              Learn more
            </Link>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            You're authorizing us to charge your account. If you have sufficient
            funds, we will withdraw from your account balance. If not, the full
            amount will be charged to your primary billing method.{" "}
            <Link href="#" underline="hover">
              Learn more
            </Link>
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="contained" color="primary" fullWidth>
              Payment
            </Button>
            <Button variant="outlined" color="secondary" fullWidth>
              Cancel
            </Button>
          </Box>
        </Paper>

        {/* Footer */}
      </Container>
      <Footer />
    </div>
  );
}
