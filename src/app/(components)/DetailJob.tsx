/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Button, Grid, Alert, Rating, Avatar } from "@mui/material";
import { getCurrUser } from "@/utils/utils";
import { useRouter } from "next/navigation";
import Loading from "../(pages)/loading";
import axios from "axios";

interface DetailJobProps {
  id: string;
}

const DetailJob: React.FC<DetailJobProps> = ({ id }) => {
  const [post, setPost] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTransaction, setActiveTransaction] = useState<boolean>(false);
  const [currUser, setCurrUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch post details
        const postResponse = await axios.get(`/api/posts/${id}`);
        setPost(postResponse.data);

        const user = await getCurrUser();
        setCurrUser(user);

        if (user) {
          // Fetch transactions
          const transactionsResponse = await axios.get(`/api/transaction?post_id=${id}&email=${user.email}`);
          const transactionsData = transactionsResponse.data;
          console.log(transactionsData);
          
          // check if theres a transaction with status pending, in-progress, or completed
          const hasActiveTransaction = transactionsData.some(
            (transaction: any) =>
              transaction.trans_status === "pending" ||
              transaction.trans_status === "in-progress" ||
              transaction.trans_status === "completed"
          );

          if (hasActiveTransaction) {
            // Handle the case where there is an active transaction
            console.log("There is an active transaction");
            setActiveTransaction(true);
          }
        }

        // Fetch reviews
        const reviewsResponse = await axios.get(`/api/review?id=${id}`);
        setReviews(reviewsResponse.data.data);
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
    
  const handleHire = async () => {
    if (!currUser) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (currUser.role !== "client") {
      alert("Only clients can hire freelancers");
      return;
    }

    try {
      const response = await axios.post("/api/transaction", {
        email: currUser.email,
        post_id: id,
        price: post.price,
      });

      if (response.status === 201) {
        alert("Successfully hired freelancer. Please wait for the freelancer to accept");
        setActiveTransaction(true);
      } else {
        alert("Failed to hire freelancer");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("An error occurred while hiring the freelancer");
    }
  };

  if (loading) {
    return (
      <Loading />
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
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => router.push(`/profile/${post.postMaker._id}`)}
          >
            <Avatar src={post.postMaker.pfp_path} alt={post.postMaker.name} sx={{ marginRight: "1rem" }} />
            <Box>
              <Typography variant="subtitle1" color="text.secondary">
                {post.postMaker.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {post.postMaker.email}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: post.postMaker.status === "Available" ? "green" : "red",
                    marginRight: "0.5rem",
                  }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  {post.postMaker.status}
                </Typography>
              </Box>
            </Box>
          </Box>
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

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "1rem" }}
          disabled={activeTransaction}
          onClick={handleHire}
        >
          {activeTransaction ? "There's an active transaction" : "Hire"}
        </Button>
      </Box>
    </Box>
  );
};

export default DetailJob;
