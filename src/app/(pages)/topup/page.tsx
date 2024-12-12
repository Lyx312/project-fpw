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

const colorPalette = {
  darkBlue: "#001F3F",
  mediumBlue: "#3A6D8C",
  lightBlue: "#6A9AB0",
  beige: "#EAD8B1",
  gradientButton: "linear-gradient(45deg, #3A6D8C, #6A9AB0)",
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
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: colorPalette.beige,
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            color={colorPalette.darkBlue}
            sx={{ fontWeight: "bold" }}
          >
            Buy Tokens
          </Typography>

          <Typography
            variant="body1"
            gutterBottom
            color={colorPalette.mediumBlue}
          >
            Your available tokens: {" "}
            <Typography
              component="span"
              fontWeight="bold"
              color={colorPalette.darkBlue}
            >
              {availableTokens}
            </Typography>
          </Typography>

          <TextField
            fullWidth
            type="number"
            label="Insert token to buy"
            value={tokenToBuy}
            onChange={handleTokenChange}
            sx={{
              my: 2,
              bgcolor: "white",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
            variant="outlined"
            InputProps={{
              style: { color: colorPalette.darkBlue },
            }}
          />

          <Typography
            variant="body1"
            gutterBottom
            color={colorPalette.mediumBlue}
          >
            Your token balance will be: {" "}
            <Typography
              component="span"
              fontWeight="bold"
              color={colorPalette.darkBlue}
            >
              {availableTokens + tokenToBuy}
            </Typography>
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 2 }}
          >
            This bundle of Tokens will expire 1 year from today. Unused Tokens
            rollover to the next month. {" "}
            <Link
              href="#"
              underline="hover"
              color={colorPalette.mediumBlue}
            >
              Learn more
            </Link>
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 1 }}
          >
            You're authorizing us to charge your account. If you have sufficient
            funds, we will withdraw from your account balance. If not, the full
            amount will be charged to your primary billing method. {" "}
            <Link
              href="#"
              underline="hover"
              color={colorPalette.mediumBlue}
            >
              Learn more
            </Link>
          </Typography>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  padding: "12px",
                  background: colorPalette.gradientButton,
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "30px",
                  "&:hover": {
                    backgroundColor: colorPalette.lightBlue,
                  },
                }}
              >
                Payment
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  padding: "12px",
                  borderColor: colorPalette.darkBlue,
                  color: colorPalette.darkBlue,
                  borderRadius: "30px",
                  fontWeight: "bold",
                  "&:hover": {
                    borderColor: colorPalette.mediumBlue,
                    backgroundColor: colorPalette.beige,
                  },
                }}
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
