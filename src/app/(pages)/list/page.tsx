import React from "react";
import { Box } from "@mui/material";
import JobCard from "@/app/(components)/JobCard";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";

const page = () => {
  return (
    <div>
      <Header />
      <Box
        sx={{
          backgroundColor: "#002244",
          minHeight: "100vh",
          padding: 4,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default page;
