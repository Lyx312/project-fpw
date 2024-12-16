import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import AdminSideBar from '../../(components)/AdminSideBar';

const drawerWidth = 120; // Set the width of the sidebar

const colorPalette = {
  darkBlue: "#001F3F",
  mediumBlue: "#3A6D8C",
  lightBlue: "#6A9AB0",
  beige: "#EAD8B1",
  gradientButton: "linear-gradient(45deg, #3A6D8C, #6A9AB0)",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          backgroundColor: colorPalette.darkBlue,
          color: colorPalette.beige,
          height: '100vh',
        }}
      >
        <AdminSideBar />
      </Box>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` },
          p: 3,
          backgroundColor: colorPalette.beige,
          color: colorPalette.darkBlue,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
