'use client';
import React, { useEffect, useState } from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Popover,
  Link,
  Avatar,
} from "@mui/material";

import WorkIcon from "@mui/icons-material/Work";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import Image from "next/image";
import { getCurrUser, logout } from "@/utils/utils";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  interface User {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    pfp_path: string;
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
      // console.log(user);

      if (user) {
        const mappedUser: User = {
          id: user.id as string,
          first_name: user.first_name as string,
          last_name: user.last_name as string,
          role: user.role as string,
          pfp_path: user.pfp_path as string,
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

        <Link href="/" color="inherit">
          <IconButton color="inherit">
            <HomeIcon/>
          </IconButton>
        </Link>

        <Link href="/posts" color="inherit">
          <IconButton color="inherit">
            <WorkIcon />
          </IconButton>
        </Link>
        {currUser ? (
          <>
            <Link
              href={
                currUser.role === "freelancer"
                  ? "/freelancer/history"
                  : "/client/history"
              }
              color="inherit"
            >
              <IconButton color="inherit">
                <HistoryIcon />
              </IconButton>
            </Link>
          </>
        ) : null}
        <IconButton color="inherit" onClick={handlePopoverOpen}>
          {!currUser?.pfp_path && (<AccountCircleIcon />)}
          {currUser?.pfp_path && (
            <Avatar
              alt="avatar"
              src={`${currUser?.pfp_path || ""}`}
              sx={{
                width: 30,
                height: 30,
                border: "2px solid #1A2A3A",
              }}
            />
          )}
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
          slotProps={{
            paper: {
              sx: {
                borderRadius: 2,
                boxShadow: 3,
                minWidth: 100,
                padding: 2,
              },
            },
          }}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 100,
            padding: 2,
          }}
        >
          <div>
            {currUser ? (
              <>
                <Typography variant="body2" align="center" gutterBottom>
                  Welcome, {currUser.first_name + " " + currUser.last_name || "User"}!
                </Typography>
                <Typography variant="body2" align="center">
                  <Link href="/profile" underline="hover">
                    Go to Profile
                  </Link>
                  <br />
                  <Link href="/login" underline="hover" onClick={logout}>
                    Logout
                  </Link>
                </Typography>
              </>
            ) : (
              <>
                <Typography component="div" variant="body2" align="center" gutterBottom>
                  You&apos;re not logged in.
                </Typography>
                <Typography component="div" variant="body2" align="center">
                  <Link href="/login" underline="hover">
                    Go to Login
                  </Link>
                </Typography>
              </>
            )}
          </div>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
