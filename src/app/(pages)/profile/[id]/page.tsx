"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Container,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import Footer from "@/app/(components)/Footer";
import Header from "@/app/(components)/Header";
import axios from "axios";
import { useParams } from "next/navigation";

interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  gender: string;
  country_id: string;
  country_name: string;
  categories?: Category[];
  exp: number;
  pfp_path: string;
  status?: string;
}

interface Category {
  _id: string;
  category_id: number;
  category_name: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  averageRating: number;
}

interface Review {
  review_id: number,
  review_rating: number,
  review_description: string,
  post_id: number,
  post_title: string,
}

const UserProfile = () => {
  const [freelancer, setFreelancer] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { id } = useParams<{ id: string }>();

  const fetchFreelancer = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`
      );
      const user = response.data;

      if (user) {
        setFreelancer(user);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?freelancerId=${freelancer?.email}`
      );
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/reviews/?clientId=${freelancer?.email}`
      );
      setReviews(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFreelancer();
    }
  }, [id]);

  useEffect(() => {
    if (freelancer && freelancer.role === "freelancer") {
      fetchPosts();
    }
    else if (freelancer && freelancer.role === "client") {
      fetchComments();
    }
  }, [freelancer]);

  const colorPalette = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    beige: "#EAD8B1",
    gradientCard: "linear-gradient(135deg, #3A6D8C, #6A9AB0)",
    gradientButton: "linear-gradient(45deg, #3A6D8C, #6A9AB0)",
  };

  return (
    <Box sx={{ backgroundColor: "#1A2A3A", minHeight: "100vh" }}>
      <Header />

      <Container
        sx={{
          maxWidth: "800px",
          margin: "20px auto",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        }}
      >
        {freelancer ? (
          freelancer.role === "client" ? (
            // Display content for "client"
            <>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                  <Avatar
                    alt="avatar"
                    src={`${freelancer.pfp_path || ""}`}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "3px solid #1A2A3A",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={10} textAlign="left">
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#1A2A3A" }}
                  >
                    {freelancer.first_name} {freelancer.last_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {freelancer.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Phone: {freelancer.phone}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Country: {freelancer.country_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Gender: {freelancer.gender === "M" ? "Male" : "Female"}
                  </Typography>
                </Grid>
              </Grid>
              <Box mt={4}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#1A2A3A" }}
                >
                  Reviews
                </Typography>
                <Grid container spacing={2} mt={2}>
                  {reviews.map((post) => (
                    <Grid item xs={12} md={6} key={post.review_id}>
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
                        onClick={() =>
                          (window.location.href = `/posts/detail/${post.post_id}`)
                        }
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
                            {post.post_title}
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
                            {post.review_description}
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
                          Rating: {post.review_rating}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
            </>
          ) : (
            // Display content for "freelancer"
            <>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                  <Avatar
                    alt="avatar"
                    src={`${freelancer.pfp_path || ""}`}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "3px solid #1A2A3A",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={10} textAlign="left">
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#1A2A3A" }}
                  >
                    {freelancer.first_name} {freelancer.last_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {freelancer.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Phone: {freelancer.phone}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Country: {freelancer.country_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Gender: {freelancer.gender === "M" ? "Male" : "Female"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        backgroundColor:
                          freelancer.status === "Available" ? "green" : "red",
                        display: "inline-block",
                        marginRight: "5px",
                        borderRadius: "50%",
                      }}
                    />
                    {freelancer.status}
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant="subtitle1" sx={{ color: "#1A2A3A" }}>
                  Categories
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {freelancer.categories?.map((category) => (
                    <Chip
                      key={category._id}
                      label={category.category_name}
                      sx={{ backgroundColor: "#6accf7" }}
                    />
                  ))}
                </Box>
              </Box>

              <Box mt={4}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#1A2A3A" }}
                >
                  Posts
                </Typography>
                <Grid container spacing={2} mt={2}>
                  {posts.map((post) => (
                    <Grid item xs={12} md={6} key={post.id}>
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
                        onClick={() =>
                          (window.location.href = `/posts/detail/${post.id}`)
                        }
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
                            {post.title}
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
                            {post.description}
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
                          Rating: {post.averageRating}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )
        ) : (
          <Typography variant="h6" sx={{ color: "#1A2A3A" }}>
            Loading...
          </Typography>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default UserProfile;
