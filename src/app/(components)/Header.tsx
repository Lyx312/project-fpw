import React from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Header = () => {
  return (
    <AppBar
      position="static"
      color="primary"
      sx={{ backgroundColor: "#87CEEB" }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LOGO
        </Typography>
        <TextField
          placeholder="Search"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            minWidth: "200px",
            mr: 2,
          }}
        />
        <IconButton color="inherit">
          <ShoppingCartIcon />
        </IconButton>
        <IconButton color="inherit">
          <HelpOutlineIcon />
        </IconButton>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
