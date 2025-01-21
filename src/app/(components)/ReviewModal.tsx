import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Typography,
    IconButton,
  } from "@mui/material";
  import StarIcon from "@mui/icons-material/Star";
  import StarBorderIcon from "@mui/icons-material/StarBorder";
  import { useState } from "react";
  import axios from "axios";
import { baseUrl } from "@/config/url";
  
  interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    transId: string;
    postId: string;
    postTitle: string;
    email: string;
    onSubmitSuccess: () => void;
  }
  
  const ReviewModal: React.FC<ReviewModalProps> = ({
    open,
    onClose,
    transId,
    postId,
    postTitle,
    email,
    onSubmitSuccess,
  }) => {
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewDescription, setReviewDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const handleSubmit = async () => {
      if (!reviewRating || !reviewDescription) {
        setError("Please fill in all fields.");
        return;
      }
      setLoading(true);
      try {
        await axios.post("/api/review", {
          email: email,
          review_rating: reviewRating,
          review_description: reviewDescription,
          post_id: postId,
        });
        await axios.put(
          `${baseUrl}/api/transaction/${transId}/complete`
        );
        alert("Transaction completed successfully. Thank you for your review!");
        onSubmitSuccess();
        onClose();
      } catch {
        setError("Failed to submit the review.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>{postTitle || "Submit Review"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Rating</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton
                    key={star}
                    onClick={() => setReviewRating(star)}
                    sx={{ color: star <= reviewRating ? "#FFD700" : "#ccc" }}
                  >
                    {star <= reviewRating ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Your Review"
                multiline
                rows={4}
                fullWidth
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
              />
            </Grid>
          </Grid>
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ReviewModal;
  