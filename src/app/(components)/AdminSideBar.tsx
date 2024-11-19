import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AdminSideBar = () => {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "#6A94AA", // Warna biru sidebar
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        Freelance Hub.
      </Typography>

      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Category & Country" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Applications" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText primary="Transaction" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default AdminSideBar;
