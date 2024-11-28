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
  Grid,
} from "@mui/material";
import Footer from "@/app/(components)/Footer";
import Header from "@/app/(components)/Header";

const colors = {
  primary: "#00796b",   // Teal
  secondary: "#f57c00", // Amber
  background: "#f5f5f5", // Light Gray
  text: "#212121",      // Dark Gray
};

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
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* Main Content */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 2, backgroundColor: colors.background }}>
          <Typography variant="h6" gutterBottom color={colors.text}>
            Buy Tokens
          </Typography>

          <Typography variant="body1" gutterBottom color={colors.text}>
            Your available tokens:{" "}
            <Typography component="span" fontWeight="bold" color={colors.primary}>
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
            variant="outlined"
            InputProps={{
              style: { color: colors.text },
            }}
          />

          <Typography variant="body1" gutterBottom color={colors.text}>
            Your token balance will be:{" "}
            <Typography component="span" fontWeight="bold" color={colors.primary}>
              {availableTokens + tokenToBuy}
            </Typography>
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            This bundle of Tokens will expire 1 year from today. Unused Tokens
            rollover to the next month.{" "}
            <Link href="#" underline="hover" color={colors.primary}>
              Learn more
            </Link>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            You're authorizing us to charge your account. If you have sufficient
            funds, we will withdraw from your account balance. If not, the full
            amount will be charged to your primary billing method.{" "}
            <Link href="#" underline="hover" color={colors.primary}>
              Learn more
            </Link>
          </Typography>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ padding: "12px", backgroundColor: colors.primary, "&:hover": { backgroundColor: "#004d40" } }}
              >
                Payment
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ padding: "12px", borderColor: colors.secondary, color: colors.secondary, "&:hover": { borderColor: "#e65100", backgroundColor: "#fff3e0" } }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}
