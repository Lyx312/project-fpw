import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const Header = () => {
  return (
    <div>
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
    </div>
  );
};

export default Header;
