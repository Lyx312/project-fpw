import React from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  QuestionMark as QuestionIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import SocialMediaIcons from "../(components)/SocialMediaIcons";
import Header from "../(components)/Header";
import Footer from "../(components)/Footer";

const LandingPage = () => {
  const categories = [
    "Art Design",
    "UI & UX Design",
    "Data Entry",
    "Graphic Design",
    "Video Editing",
    "Virtual Assistant",
    "Website Design",
    "Mobile App Programming",
    "Social Media Manager",
  ];

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      {/* <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            LOGO
          </Typography>
          <TextField
            size="small"
            placeholder="Search"
            sx={{ mr: 2, backgroundColor: 'white' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton><QuestionIcon /></IconButton>
        </Toolbar>
      </AppBar> */}
      <Header />

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom>
              Join the world's work marketplace
            </Typography>
            <Typography variant="h5" gutterBottom>
              Find & Hire Expert Freelancers
            </Typography>
            <TextField
              fullWidth
              placeholder="Search"
              sx={{ mt: 2, mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Post a Job for Free?
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Hero image would go here */}
          </Grid>
        </Grid>
      </Container>

      {/* Professional Services Section */}
      <Box sx={{ backgroundColor: "#f5f5f5", py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom align="center">
            Find the Professional Services
          </Typography>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={4} key={item}>
                <Card sx={{ height: 200 }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box sx={{ backgroundColor: "#002145", color: "white", py: 8 }}>
        <Container maxWidth="xl">
          <TextField
            fullWidth
            placeholder="Search Skills"
            sx={{ mb: 4, backgroundColor: "white" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card sx={{ height: 100 }} />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4, display: "block", mx: "auto" }}
          >
            More Skills
          </Button>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom align="center">
            Easy Way to Get Jobs Around the World
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary">
                Indonesia
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary">
                World
              </Button>
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom>
            Recommendation Category
          </Typography>
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: "#002145", color: "white" }}
                >
                  {category}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      {/* <Box sx={{ backgroundColor: '#87CEEB', color: 'black', py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuestionIcon sx={{ mr: 1 }} />
                <Typography>Help & Supports</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography>xx,xxx,xxx Registered Users</Typography>
              <Typography>xx,xxx,xxx Total Jobs Posted</Typography>
            </Box>
            <SocialMediaIcons />
          </Box>
          <Typography align="right" sx={{ mt: 2 }}>
            Copyright © 2024 Freelance Hub
          </Typography>
        </Container>
      </Box> */}
      <Footer />
    </Box>
  );
};

export default LandingPage;
