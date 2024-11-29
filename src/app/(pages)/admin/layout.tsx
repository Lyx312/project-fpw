import React from "react";
import { Box, CssBaseline } from "@mui/material";
import AdminSideBar from "../../(components)/AdminSideBar";

const drawerWidth = 120; // Set the width of the sidebar

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <AdminSideBar />
      </Box>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` }, // Add margin-left for main content
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
