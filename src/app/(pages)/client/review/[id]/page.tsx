"use client";
import { useRouter } from "next/navigation";
import { getCurrUser } from "@/utils/utils";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface ReviewPageProps {
  params: Promise<{ id: string }>;
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
  const unwrappedParams = React.use(params); // Unwrap the params Promise
  const { id } = unwrappedParams; // Access the `id` property
  const router = useRouter();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [postTitle, setPostTitle] = useState<string>("");

  useEffect(() => {
    const fetchUserAndPost = async () => {
      setLoading(true);
      try {
        // Fetch the current user
        const user = await getCurrUser();
        if (user) {
          setCurrUser(user as unknown as User);
        }

        // Fetch the post details
        const postResponse = await axios.get(`/api/posts/${id}`);
        const post = postResponse.data;

        if (post?.title) {
          setPostTitle(post.title);
        } else {
          setPostTitle("Unknown Post");
        }
      } catch (error) {
        console.error("Error fetching user or post details:", error);
        setError("Failed to fetch post details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPost();
  }, [id]);

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
      setReviewRating(0);
      setReviewDescription("");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit the review. Please try again.");
    } finally {
      setLoading(false);
    }
    router.push(`/`);
  };

  return (
    <Box sx={{ backgroundColor: "#001F3F", minHeight: "100vh", color: "#fff" }}>
      <Header />
      <Container sx={{ paddingY: 4 }}>
        <Paper
          sx={{
            backgroundColor: "#2B3B4B",
            padding: 4,
            borderRadius: 2,
            color: "#fff",
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {postTitle || "Loading..."}
          </Typography>
          <Grid container spacing={3}>
          <Grid item xs={12}>
        <Typography variant="h6" sx={{ color: "#fff", marginBottom: 1 }}>
          Review Rating
        </Typography>
        <StarRating rating={reviewRating} setRating={setReviewRating} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ color: "#fff", marginBottom: 1 }}>
          Review Description
        </Typography>
        <TextField
          label="Write your review"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={reviewDescription}
          onChange={(e) => setReviewDescription(e.target.value)}
          InputProps={{
            sx: { backgroundColor: "#1E2E3E", color: "#fff" },
          }}
          InputLabelProps={{ style: { color: "#fff" } }}
        />
      </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1A2AAA",
                "&:hover": { backgroundColor: "#1230EE" },
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" sx={{ marginTop: 2 }}>
              {success}
            </Typography>
          )}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconButton
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          sx={{ color: "#FFD700" }} // Gold color for stars
        >
          {hover !== null ? (star <= hover ? <StarIcon /> : <StarBorderIcon />) : star <= rating ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      ))}
      <Typography variant="body2" sx={{ marginLeft: 2, color: "#fff" }}>
        {hover !== null ? hover : rating} / 5
      </Typography>
    </Box>
  );
};

export default PostReviewPage;
