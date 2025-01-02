'use client';
import { Box, Typography, Container, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import {
  QuestionMark as QuestionIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import SocialMediaIcons from "./SocialMediaIcons";
import axios from "axios";

const footerLinks = {
  Category: ["Categories", "Projects", "Freelancers", "Membership"],
  About: ["About Us", "How it Works", "Team", "Community"],
  Terms: [
    "Privacy Policy",
    "Terms & Conditions",
    "Fees and Charges",
    "Feedback",
  ],
};

const Footer = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`
      );
      setTotalUsers(response.data.length-1);
    };

    const fetchJobs = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`
      );
      setTotalJobs(response.data.data.length);
    };

    fetchUsers();
    fetchJobs();
    
  }, [])
  

  return (
    <div>
      <Box sx={{ backgroundColor: "#87CEEB", color: "black", py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <QuestionIcon sx={{ mr: 1 }} />
                <Typography>Help & Supports</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LanguageIcon sx={{ mr: 1 }} />
                <Typography>International</Typography>
              </Box>
            </Grid>
            {Object.entries(footerLinks).map(([title, links]) => (
              <Grid item xs={12} md={3} key={title}>
                <Typography variant="h6" gutterBottom>
                  {title}
                </Typography>
                {links.map((link) => (
                  <Typography key={link} sx={{ mb: 1 }}>
                    {link}
                  </Typography>
                ))}
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography>{totalUsers} Registered Users</Typography>
              <Typography>{totalJobs} Total Jobs Posted</Typography>
            </Box>
            <SocialMediaIcons />
          </Box>
          <Typography align="right" sx={{ mt: 2 }}>
            Copyright © 2024 Freelance Hub
          </Typography>
        </Container>
      </Box>
    </div>
  );
};

export default Footer;
