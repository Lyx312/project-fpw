"use client";

import React, { useEffect, useState } from "react";
import {
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
import Header from "../(components)/Header";
import Footer from "../(components)/Footer";
import axios from "axios";
import { getCurrUser } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { ICategory } from "@/models/categoryModel";

const LandingPage = () => {
  interface Service {
    id: number;
    title: string;
    description: string;
    averageRating: number;
  }

  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [serviceByRating, setServiceByRating] = useState<Service[]>([]);
  const [recommendedCategories, setRecommendedCategories] = useState<string[]>([]);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");

      if (response) {
        setAllCategories(response.data.data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchService = async () => {
    try {
      const response = await axios.get("/api/posts");

      if (response) {
        const sortedData = response.data.data.sort(
          (a: { averageRating: number }, b: { averageRating: number }) =>
            b.averageRating - a.averageRating
        );

        // console.log(sortedData);
        setServiceByRating(sortedData);
      } else {
        console.error("Failed to fetch Service");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchRecommendedCategories = async () => {
    try {
      const user = await getCurrUser();
      if (user && user.role === "client") {
        const response = await axios.get("/api/category/recommended", {
          params: { userId: user._id },
        });

        if (response) {
          setRecommendedCategories(response.data);
        } else {
          console.error("Failed to fetch recommended categories");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchService();
    fetchRecommendedCategories();
  }, []);

  const colorPalette = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    beige: "#EAD8B1",
    gradientCard: "linear-gradient(135deg, #3A6D8C, #6A9AB0)",
    gradientButton: "linear-gradient(45deg, #3A6D8C, #6A9AB0)",
  };

  const handleCardClick = (id: number) => {
    router.push(`/posts/detail/${id}`);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: colorPalette.darkBlue, color: "white" }}>
      <Header />

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{ mt: 8, mb: 8, height: "100vh", display: "flex" }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontWeight: "bold" }} gutterBottom>
              Join the world&apos;s work marketplace
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
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Professional Services Section */}
      <Box sx={{ backgroundColor: colorPalette.beige, py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              color: colorPalette.darkBlue,
              textShadow: "1px 1px 4px rgba(0, 0, 0, 0.3)",
              mb: 4,
            }}
          >
            Find the Professional Services
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {serviceByRating.slice(0, 3).map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  sx={{
                    height: 280,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    textDecoration: "none",
                    borderRadius: "16px",
                    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
                    background: colorPalette.gradientCard,
                    color: "white",
                    padding: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleCardClick(item.id)}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)",
                        mb: 2,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        color: "rgba(240, 240, 240, 0.9)",
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                        mb: 2,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#FFD700",
                      fontWeight: "bold",
                      mt: 2,
                    }}
                  >
                    Rating: {item.averageRating}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
            Recommendation Categories
          </Typography>
          <Grid container spacing={2}>
            {allCategories.slice(0, 9).map((category, index) => (
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
                  {category.category_name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Personalized Recommendations Section */}
      {
        recommendedCategories.length > 0 && (
          <Box sx={{ py: 10, backgroundColor: colorPalette.lightBlue }}>
            <Container maxWidth="lg">
              <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }} gutterBottom>
                Personalized Recommendations
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {recommendedCategories.slice(0, 9).map((category, index) => (
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
                        "&:hover": { bgcolor: colorPalette.mediumBlue },
                      }}
                    >
                      {category}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        )
      }

      <Footer />
    </Box>
  );
};

export default LandingPage;
