import React from "react";
import { Box, Typography, Button, TextField, Grid, Chip } from "@mui/material";

export default function MintBurnJob() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#adc8d8", // Sesuaikan warna latar
          color: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Judul */}
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: "18px",
            marginBottom: "1rem",
          }}
        >
          Developer for Display "Mint" and "Burn" transaction to Ethereum Tokens
        </Typography>

        {/* Harga */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: "white",
            fontSize: "16px",
            marginBottom: "2rem",
          }}
        >
          Rp 8.000.000 - Rp 15.000.000
        </Typography>

        {/* Deskripsi */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            marginBottom: "1rem",
            lineHeight: 1.6,
          }}
        >
          Description Jobs Description Jobs Description Jobs Description Jobs
          Description Jobs Description Jobs Description Jobs. Description Jobs
          Description Jobs Description Jobs Description Jobs Description Jobs.
        </Typography>

        {/* Skill and Expertise */}
        <Typography
          variant="body1"
          sx={{
            fontSize: "16px",
            marginTop: "2rem",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          Skill and Expertise
        </Typography>
        <Grid container spacing={1} sx={{ marginBottom: "2rem" }}>
          {["HTML", "HTML", "HTML", "HTML"].map((skill, index) => (
            <Grid item key={index}>
              <Chip
                label={skill}
                sx={{
                  backgroundColor: "#FFDA00", // Warna kuning
                  color: "black",
                  fontWeight: "bold",
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* About the Job */}
        <Box
          sx={{
            backgroundColor: "#c7d8e0",
            color: "black",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{
              fontSize: "14px",
              marginBottom: "0.5rem",
            }}
          >
            About the Job
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            Token: 10 to 50
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            Place: Remote Project
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            Viewed: 7 mins ago
          </Typography>
        </Box>

        {/* Place Your Bid */}
        <Box
          sx={{
            backgroundColor: "#c7d8e0",
            color: "black",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{
              fontSize: "14px",
              marginBottom: "1rem",
            }}
          >
            Place your bid
          </Typography>
          <TextField
            label="Bid amount"
            type="number"
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              marginBottom: "1rem",
              backgroundColor: "white",
              borderRadius: "4px",
            }}
          />
          <TextField
            label="Email address"
            type="email"
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              marginBottom: "1rem",
              backgroundColor: "white",
              borderRadius: "4px",
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#007bff",
              color: "white",
              textTransform: "none",
            }}
          >
            Place bid
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
