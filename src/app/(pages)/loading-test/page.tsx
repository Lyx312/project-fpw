// pages/loading-test.tsx
'use client'
import React, { useState, useEffect } from "react";
import Loading from "../loading";
import { Box, Typography } from "@mui/material";

const LoadingTest = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Typography variant="h4" align="center" mt={5}>
          Content Loaded Successfully 🎉
        </Typography>
      )}
    </Box>
  );
};

export default LoadingTest;
