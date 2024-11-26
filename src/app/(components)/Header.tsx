'use client'
import React, { useState } from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  TextField,
  Box,
  Popover,
  Link,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Image from "next/image";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{ backgroundColor: "#87CEEB" }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/">
            <Image src="/assets/images/logo.png" alt="Logo" width={100} height={50} />
          </Link>
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
        
        <Link href="/list" color="inherit">
          <IconButton color="inherit">
            <WorkIcon />
          </IconButton>
        </Link>
        <IconButton color="inherit">
          <HelpOutlineIcon />
        </IconButton>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handlePopoverOpen}>
        <AccountCircleIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          zIndex: 1300,
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 100,
            padding: 2,
          },
        }}
      >
        <Box>
          <Typography variant="body2" align="center" gutterBottom>
            You're not logged in.
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/login" underline="hover">
              Go to Login
            </Link>
          </Typography>
        </Box>
      </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
