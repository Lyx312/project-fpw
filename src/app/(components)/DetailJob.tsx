/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Button, Grid, Alert, Rating, Avatar, IconButton } from "@mui/material";
import { getCurrUser } from "@/utils/utils";
import { useRouter } from "next/navigation";
import Loading from "../(pages)/loading";
import axios from "axios";
import ChatIcon from "@mui/icons-material/Chat";

interface DetailJobProps {
  id: string;
}

declare global {
  interface Window {
    snap: any; // Adding snap to the global Window interface
  }
}

const DetailJob: React.FC<DetailJobProps> = ({ id }) => {
  const [post, setPost] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTransaction, setActiveTransaction] = useState<boolean>(false);
  const [currUser, setCurrUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snapLoaded, setSnapLoaded] = useState(false);

  const router = useRouter();

  // Utility to load Snap.js dynamically
  const loadSnapScript = async () => {
    if (!snapLoaded) {
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
      );
      script.onload = () => setSnapLoaded(true);
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch post details
        const postResponse = await axios.get(`/api/posts/${id}`);
        setPost(postResponse.data);

        if (postResponse.data.status === "unavailable") {
          setActiveTransaction(true);
        } else {
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

  useEffect(() => {
    loadSnapScript();
  }, []);

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
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/midtrans`,
            {
              transactionId: response.data.savedUserTrans.trans_id,
            }
          );
    
          const snapToken = data.token;
    
          if (!snapLoaded) {
            alert("Payment gateway not fully loaded. Please wait and try again.");
            return;
          }
    
          // Proceed with the payment using the snap token
          window.snap.pay(snapToken, {
            onSuccess: async (result: any) => {
              try {
                await axios.put(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/api/midtrans`,
                  {
                    transactionId: response.data.savedUserTrans.trans_id,
                  }
                );
                alert("Successfully hired freelancer. Please wait for the freelancer to accept");
                setActiveTransaction(true);
                console.log("Payment success:", result);
              } catch (err) {
                console.error("Error marking transaction as completed:", err);
                alert("Failed to mark transaction as completed after popup close.");
              }
            },
            onPending: async () => {
              alert("Payment is pending. Please complete the payment to proceed.");
            },
            onError: (error: any) => {
              console.error("Payment error:", error);
              alert("Payment failed. Please try again.");
            },
            onClose: async () => {
              alert("Payment popup was closed. Transaction is not completed.");
            },
          });
        } catch (err) {
          console.error("Error initiating payment:", err);
          alert("Failed to start payment process. Please try again.");
        }
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
            {
              currUser && currUser.role === "client" && (
              <IconButton
                sx={{ marginLeft: "auto" }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/chat/${post.postMaker._id}`);
                }}
              >
                <ChatIcon />
                <Typography variant="caption" color="text.secondary" sx={{ marginLeft: "0.5rem" }}>
                  Chat
                </Typography>
              </IconButton>
              )
            }
          </Box>
        </Box>

        <Typography variant="body1" paragraph>
          {post.description}
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Price: Rp{post.price.toLocaleString()}
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

        <Box sx={{ display: "flex", alignItems: "center", marginY: "1rem" }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: post.status === "available" ? "green" : "red",
              marginRight: "0.5rem",
            }}
          />
          <Typography variant="subtitle2" color="text.secondary">
            {post.status.toLocaleString()}
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
