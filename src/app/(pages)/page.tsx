import React from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
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

  const colorPalette = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    beige: "#EAD8B1",
    gradientButton: "linear-gradient(45deg, #3A6D8C, #6A9AB0)",
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: colorPalette.darkBlue, color: "white" }}>
      <Header />

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ mt: 8, mb: 8, height: "100vh", display: "flex" }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontWeight: "bold" }} gutterBottom>
              Join the world's work marketplace
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Find & Hire Expert Freelancers
            </Typography>
            <TextField
              fullWidth
              placeholder="Search for jobs or skills"
              sx={{
                bgcolor: "white",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{
                mt: 3,
                px: 4,
                py: 1.5,
                background: colorPalette.gradientButton,
                color: "white",
                fontWeight: "bold",
                borderRadius: "30px",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Post a Job for Free
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="assets/images/landing-ilustration.svg"
              alt="Hero Section"
              sx={{
                width: "80%",
                borderRadius: "16px",
                
                // boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Professional Services Section */}
      <Box sx={{ backgroundColor: colorPalette.beige, py: 10 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
            Find the Professional Services
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={4} key={item}>
                <Card
                  sx={{
                    height: 250,
                    borderRadius: "16px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-10px)" },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      Service {item}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box sx={{ backgroundColor: colorPalette.mediumBlue, color: "white", py: 10 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            Explore Popular Skills
          </Typography>
          <TextField
            fullWidth
            placeholder="Search for skills"
            sx={{
              mb: 4,
              bgcolor: "white",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card
                  sx={{
                    height: 120,
                    borderRadius: "16px",
                    bgcolor: colorPalette.lightBlue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-10px)", background: colorPalette.darkBlue, color: colorPalette.beige },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Skill {item}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
            Easy Way to Get Jobs Around the World
          </Typography>
          <Grid container spacing={2} sx={{ my: 4 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  borderRadius: "30px",
                  background: colorPalette.gradientButton,
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Indonesia
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  borderRadius: "30px",
                  background: colorPalette.gradientButton,
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                World
              </Button>
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4 }}>
            Recommendation Categories
          </Typography>
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.5,
                    borderRadius: "30px",
                    bgcolor: colorPalette.darkBlue,
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": { bgcolor: colorPalette.lightBlue },
                  }}
                >
                  {category}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default LandingPage;
