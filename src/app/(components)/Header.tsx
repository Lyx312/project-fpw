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
  Box,
} from "@mui/material";

import WorkIcon from "@mui/icons-material/Work";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment"; // Import the new icon
import Notifications from "@/app/(components)/Notifications"; // Import the Notifications component
import Image from "next/image";
import { getCurrUser, logout } from "@/utils/utils";
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setUser, clearUser } from '@/app/redux/slices/userSlice';
import { useRouter } from "next/navigation";
import { RootState } from "@/app/redux/store";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const dispatch = useAppDispatch();
  const currUser = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchFromCookie = async () => {
      if (!currUser._id) {
        const payload = await getCurrUser();
        // console.log(payload)
        if (payload) {
          dispatch(setUser(payload));
          console.log("User set from cookie");
        } else {
          console.log("No user in cookie");
        }
      } else {
        console.log("User already set");
      }
    };
    fetchFromCookie();
  }, [currUser._id, dispatch]);

  const handleLogout = async () => {
    dispatch(clearUser());
    await logout();
    router.push("/login");
  }

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
            <HomeIcon />
          </IconButton>
        </Link>

        <Link href="/posts" color="inherit">
          <IconButton color="inherit">
            <WorkIcon />
          </IconButton>
        </Link>

        <Link href="/profile" color="inherit">
          <IconButton color="inherit">
            <PeopleIcon />
          </IconButton>
        </Link>

        {currUser._id && currUser.role !== "admin" ? (
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
            {currUser.role === "freelancer" && (
              <Link href="/freelancer/posts" color="inherit">
                <IconButton color="inherit">
                  <AssignmentIcon /> {/* Use the new icon here */}
                </IconButton>
              </Link>
            )}

          </>
        ) : null}
        { currUser._id && (
          <Box>
            <Notifications />
          </Box>
        )}
        
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
            {currUser._id ? (
              <>
                <Typography variant="body2" align="center" gutterBottom>
                  Welcome, {currUser.first_name + " " + currUser.last_name || "User"}!
                </Typography>
                <Typography variant="body2" align="center">
                  {currUser.role !== "admin" ? (
                    <Link href="/my-profile" underline="hover">
                      Go to Profile
                    </Link>
                  ) : (
                    <Link href="/admin" underline="hover">
                      Go to Admin Dashboard
                    </Link>
                  )}
                  <br />
                  <Link underline="hover" onClick={handleLogout}>
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
