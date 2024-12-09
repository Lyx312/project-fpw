/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Button, Grid, CircularProgress, Alert, Rating } from "@mui/material";

interface DetailJobProps {
  id: string;
}

const DetailJob: React.FC<DetailJobProps> = ({ id }) => {
  const [post, setPost] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch post details
        const postResponse = await fetch(`/api/posts/${id}`);
        if (!postResponse.ok) {
          throw new Error("Failed to fetch post details");
        }
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/review?id=${id}`);
        const reviewsData = await reviewsResponse.json();
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        setReviews(reviewsData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.review_rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        paddingTop: "2rem",
        color: 'black'
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: 3,
          padding: "2rem",
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {`By: ${post.postMaker}`}
          </Typography>
        </Box>

        <Typography variant="body1" paragraph>
          {post.description}
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Price: {post.price.toLocaleString()} Tokens
        </Typography>

        <Box sx={{ marginY: "1rem" }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Categories:
          </Typography>
          <Grid container spacing={1}>
            {post.categories.map((category: string, index: number) => (
              <Grid item key={index}>
                <Chip label={category} color="primary" />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginY: "1rem" }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Average Rating:
          </Typography>
          <Rating
            value={averageRating}
            precision={0.1}
            readOnly
            sx={{ fontSize: "2rem" }}
          />
          <Typography variant="body2" color="text.secondary">
            {reviews.length > 0
              ? `Based on ${reviews.length} reviews`
              : "No reviews yet"}
          </Typography>
        </Box>

        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: "1rem" }}>
          Hire
        </Button>
      </Box>
    </Box>
  );
};

export default DetailJob;