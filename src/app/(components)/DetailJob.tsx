/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Alert,
  Rating,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import {
  DateTimePicker,
  LocalizationProvider
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useRouter } from "next/navigation";
import Loading from "../(pages)/loading";
import axios from "axios";
import ChatIcon from "@mui/icons-material/Chat";
import { ICategory } from "@/models/categoryModel";
import { useAppSelector } from "@/app/redux/hooks";
import { baseUrl } from "@/config/url";

interface DetailJobProps {
  id: string;
}

declare global {
  interface Window {
    snap: any;
  }
}

const DetailJob: React.FC<DetailJobProps> = ({ id }) => {
  const [post, setPost] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTransaction, setActiveTransaction] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snapLoaded, setSnapLoaded] = useState(false);

  const [openHireDialog, setOpenHireDialog] = useState(false);
  const [customRequest, setCustomRequest] = useState("");
  const [deadline, setDeadline] = useState<moment.Moment | null>(null);

  const router = useRouter();
  const currUser = useAppSelector((state) => state.user);

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
        const postResponse = await axios.get(`/api/posts/${id}`);
        setPost(postResponse.data);
        console.log(postResponse.data.categories);
        

        if (postResponse.data.status === "unavailable") {
          setActiveTransaction(true);
        } else {
          if (currUser._id) {
            const transactionsResponse = await axios.get(
              `/api/transaction?post_id=${id}&email=${currUser.email}`
            );
            const transactionsData = transactionsResponse.data;
            const hasActiveTransaction = transactionsData.some(
              (transaction: any) =>
                transaction.trans_status === "pending" ||
                transaction.trans_status === "in-progress" ||
                transaction.trans_status === "submitted"
            );
            if (hasActiveTransaction) setActiveTransaction(true);
          }
        }

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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.review_rating, 0) /
        reviews.length
      : 0;

  const handleConfirmHire = () => {
    if (!currUser._id) {
      alert("Please login first");
      router.push("/login");
      return;
    }
    if (currUser.role !== "client") {
      alert("Only clients can hire freelancers");
      return;
    }
    setOpenHireDialog(true);
  };

  const handleHire = async () => {
    try {
      const response = await axios.post("/api/transaction", {
        email: currUser.email,
        post_id: id,
        price: post.price,
        request: customRequest,
        deadline: deadline,
      });

      if (response.status === 201) {
        try {
          const { data } = await axios.post(
            `${baseUrl}/api/midtrans`,
            {
              transactionId: response.data.savedUserTrans.trans_id,
            }
          );
          const snapToken = data.token;
          if (!snapLoaded) {
            alert("Payment gateway not fully loaded. Please wait and try again.");
            return;
          }
          window.snap.pay(snapToken, {
            onSuccess: async (result: any) => {
              try {
                await axios.put(`${baseUrl}/api/midtrans`, {
                  transactionId: response.data.savedUserTrans.trans_id,
                });
                alert("Successfully hired freelancer. Please wait for acceptance.");
                setActiveTransaction(true);
                console.log("Payment success:", result);
              } catch (err) {
                console.error("Error after payment:", err);
                alert("Failed to complete transaction after popup close.");
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
              alert("Payment popup was closed. Transaction not completed.");
            },
          });
        } catch (err) {
          console.error("Error initiating payment:", err);
          alert("Failed to start payment process. Please try again.");
        }
      } else {
        alert("Failed to hire freelancer.");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("An error occurred while hiring the freelancer.");
    } finally {
      setOpenHireDialog(false);
      setCustomRequest("");
      setDeadline(null);
    }
  };

  if (loading) {
    return <Loading />;
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
        color: "black",
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
            <Avatar
              src={post.postMaker.pfp_path}
              alt={post.postMaker.name}
              sx={{ marginRight: "1rem" }}
            />
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
                    backgroundColor:
                      post.postMaker.status === "Available" ? "green" : "red",
                    marginRight: "0.5rem",
                  }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  {post.postMaker.status}
                </Typography>
              </Box>
            </Box>
            {currUser._id && currUser.role === "client" && (
              <IconButton
                sx={{ marginLeft: "auto" }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/chat/${post.postMaker._id}`);
                }}
              >
                <ChatIcon />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ marginLeft: "0.5rem" }}
                >
                  Chat
                </Typography>
              </IconButton>
            )}
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
            {Array.isArray(post.categories) && post.categories.length > 0 ? (
              post.categories.map((category: ICategory) => (
              <Grid item key={category._id}>
                <Chip label={category.category_name} color="primary" />
              </Grid>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
              No categories available
              </Typography>
            )}
          </Grid>
        </Box>

        <Box sx={{ marginY: "1rem" }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Average Rating:
          </Typography>
          <Rating value={averageRating} precision={0.1} readOnly sx={{ fontSize: "2rem" }} />
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
          onClick={handleConfirmHire}
        >
          {activeTransaction ? "There's an active transaction" : "Hire"}
        </Button>

        <Dialog open={openHireDialog} onClose={() => setOpenHireDialog(false)}>
          <DialogTitle>Request & Deadline</DialogTitle>
            <DialogContent>
            <TextField
              label="Request"
              multiline
              rows={4}
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              fullWidth
              sx={{ marginTop: 1, marginBottom: 2 }}
              InputProps={{
              inputProps: {
                style: { resize: 'vertical' }
              }
              }}
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
              label="Deadline"
              value={deadline}
              ampm={false}
              minDate={moment().add(1, "day")}
              format="DD/MM/YYYY HH:mm"
              onChange={(newValue) => setDeadline(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHireDialog(false)}>Cancel</Button>
            <Button onClick={handleHire} disabled={!customRequest || !deadline}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DetailJob;
