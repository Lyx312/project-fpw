/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Alert } from "@mui/material";

const Reviews = ({ id }: { id: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/review?id=${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch reviews");
        }

        setReviews(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ marginTop: "2rem" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: "2rem", padding: "2rem" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reviews
      </Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews yet for this post.</Typography>
      ) : (
        reviews.map((review) => (
          <Card key={review.review_id} sx={{ marginBottom: "1rem", boxShadow: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.user
                  ? `${review.user.first_name} ${review.user.last_name}`
                  : "Anonymous"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rating: {review.review_rating} / 5
              </Typography>
              <Typography variant="body2">{review.review_description}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Reviews;
