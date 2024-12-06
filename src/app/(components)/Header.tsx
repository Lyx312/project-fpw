'use client';
import React, { useEffect, useState } from "react";
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
import WorkIcon from "@mui/icons-material/Work";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { getCurrUser, logout } from "@/utils/utils";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  interface User {
    id: string;
    fullName: string;
    role: string;
    exp: number;
  }

  const [currUser, setCurrUser] = useState<User | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrUser();
      console.log(user);
      
      if (user) {
        const mappedUser: User = {
          id: user.id as string,
          fullName: user.fullName as string,
          role: user.role as string,
          exp: user.exp as number,
        };
        setCurrUser(mappedUser);
      } else {
        setCurrUser(null);
      }
    };
    fetchUser();
  }, []); // Fetch once when the component mounts.

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
        
        <Link href="/posts" color="inherit">
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
            {currUser ? (
              <>
                <Typography variant="body2" align="center" gutterBottom>
                  Welcome, {currUser.fullName || "User"}!
                </Typography>
                <Typography variant="body2" align="center">
                  <Link href="/profile" underline="hover">
                    Go to Profile
                  </Link>
                  <Box onClick={logout}>
                    <Link href="/login" underline="hover">
                      Logout
                    </Link>
                  </Box>
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" align="center" gutterBottom>
                  You're not logged in.
                </Typography>
                <Typography variant="body2" align="center">
                  <Link href="/login" underline="hover">
                    Go to Login
                  </Link>
                </Typography>
              </>
            )}
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
