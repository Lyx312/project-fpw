"use client";

import { getCurrUser } from "@/utils/utils";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ReviewPageProps {
  params: {
    id: string;
  };
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  exp: number;
}

const PostReviewPage: React.FC<ReviewPageProps> = ({ params }) => {
  const { id } = params;

  const [reviewRating, setReviewRating] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currUser, setCurrUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrUser();
        if (user) {
          setCurrUser(user as unknown as User);
        }
      } catch (error) {
        console.error("Error fetching user or posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!reviewRating || !reviewDescription) {
      setError("Please fill in all fields.");
      return;
    }

    if (
      isNaN(Number(reviewRating)) ||
      Number(reviewRating) < 1 ||
      Number(reviewRating) > 5
    ) {
      setError("Rating must be a number between 1 and 5.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/review", {
        review_rating: Number(reviewRating),
        review_description: reviewDescription,
        post_id: Number(id), // ID post dari parameter URL
        email: currUser?.email, // Email user dari context atau session
      });
      setSuccess("Review submitted successfully!");
      setReviewRating("");
      setReviewDescription("");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit the review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add Review for ID: {id}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Review Rating (1-5)"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
          />
        </Grid>
        <TextField
          label="Review Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={reviewDescription}
          onChange={(e) => setReviewDescription(e.target.value)}
        />
      </Grid>
      <Grid container justifyContent="flex-end" marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Grid>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
    </Container>
  );
};

export default PostReviewPage;
