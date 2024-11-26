'use client'
import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.paper"
      color="text.primary"
      sx={{
        transition: "background-color 0.3s ease",
        px: 3,
      }}
    >
      <CircularProgress size={80} color="primary" />
      
      <Typography 
        variant="h5"
        color="text.secondary"
        mt={2}
        sx={{
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default Loading;
