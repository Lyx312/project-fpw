/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/app/(components)/Header";
import { getCurrUser } from "@/utils/utils";
import { Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/app/(pages)/loading";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  gender: string;
  country_id: string;
  exp: number;
  pfp_path: string;
}

const FreelancerHistoryPage = () => {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [transactionToCancel, setTransactionToCancel] = useState<string | null>(null);

  const router = useRouter();

  const fetchUser = async () => {
    try {
      const user = await getCurrUser();

      if (user) {
        setCurrUser({
          _id: user._id as string,
          email: user.email as string,
          first_name: user.first_name as string,
          last_name: user.last_name as string,
          role: user.role as string,
          phone: user.phone as string,
          country_id: user.country_id as string,
          gender: user.gender as string,
          pfp_path: user.pfp_path as string,
          exp: user.exp as number,
        });
      } else {
        console.log("No user found");
        setCurrUser(null);
      }
    } catch (err) {
      setError("Failed to fetch user data");
      console.log("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTransaction = async () => {
    if (!currUser?.email) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/freelancer`,
        {
          params: { userEmail: currUser.email, status: filterStatus },
        }
      );
      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions");
    }
  };

  const handleViewPost = (postId: string) => {
    router.push(`/posts/detail/${postId}`);
  };

  const handleAcceptTransaction = async (transactionId: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/${transactionId}/accept`);
      fetchUserTransaction();
      alert("Transaction accepted successfully");
    } catch (err) {
      console.error("Error accepting transaction:", err);
      alert("Failed to accept transaction");
      setError("Failed to accept transaction");
    }
  };

  const handleCancelTransaction = async () => {
    if (!transactionToCancel) return;

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/${transactionToCancel}/cancel`, { type: "freelancer", reason: cancelReason });
      fetchUserTransaction();
      alert("Transaction cancelled successfully");
      setOpenDialog(false);
      setCancelReason("");
      setTransactionToCancel(null);
    } catch (err) {
      console.error("Error cancelling transaction:", err);
      alert("Failed to cancel transaction");
      setError("Failed to cancel transaction");
    }
  };

  const handleCompleteTransaction = async (transactionId: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/${transactionId}/complete`);
      fetchUserTransaction();
      alert("Transaction completed successfully");
    } catch (err) {
      console.error("Error completing transaction:", err);
      alert("Failed to complete transaction");
      setError("Failed to complete transaction");
    }
  };

  const openCancelDialog = (transactionId: string) => {
    setTransactionToCancel(transactionId);
    setOpenDialog(true);
  };

  const closeCancelDialog = () => {
    setOpenDialog(false);
    setCancelReason("");
    setTransactionToCancel(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (currUser) {
      fetchUserTransaction();
    }
  }, [currUser, filterStatus]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1A2A3A",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#1A2A3A", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ padding: 3 }}>
        <ButtonGroup
          variant="contained"
          fullWidth
          sx={{
            width: "100%",
            display: "flex",
            marginBottom: 1,
          }}
        >
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("")}>All</Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("pending")}>Pending</Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("in-progress")}>In Progress</Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("completed")}>Completed</Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("paid")}>Paid</Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("cancelled")}>Cancelled</Button>
        </ButtonGroup>

        {transactions.length > 0 ? (
          <Box>
            <Typography
              variant="h5"
              sx={{ marginBottom: 2, fontWeight: 600, color: "#fff" }}
            >
              Transaction History
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 2,
              }}
            >
              {transactions.map((transaction, index) => (
                <Card
                  key={index}
                  sx={{ backgroundColor: "#2B3B4B", color: "#fff" }}
                >
                  <CardContent>
                    <Typography>Client: {transaction.user_name}</Typography>
                    <Typography>Post Title: {transaction.post_title}</Typography>
                    <Typography>Price: {transaction.price}</Typography>
                    <Typography>Start Date: {transaction.start_date}</Typography>
                    <Typography>End Date: {transaction.end_date}</Typography>
                    <Typography>Status: {transaction.trans_status}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#1A2AAA",
                        "&:hover": { backgroundColor: "#1230EE" },
                      }}
                      onClick={() => handleViewPost(transaction.post_id)}
                    >
                      View Post
                    </Button>
                    {transaction.trans_status === "pending" && (
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "#1A2AAA",
                          "&:hover": { backgroundColor: "#1230EE" },
                        }}
                        onClick={() => handleAcceptTransaction(transaction.trans_id)}
                      >
                        Accept
                      </Button>
                    )}
                    {["pending", "in-progress"].includes(transaction.trans_status) && (
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "#1A2AAA",
                          "&:hover": { backgroundColor: "#1230EE" },
                        }}
                        onClick={() => openCancelDialog(transaction.trans_id)}
                      >
                        Cancel
                      </Button>
                    )}
                    {transaction.trans_status === "in-progress" && (
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "#1A2AAA",
                          "&:hover": { backgroundColor: "#1230EE" },
                        }}
                        onClick={() => handleCompleteTransaction(transaction.trans_id)}
                      >
                        Complete
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ color: "#fff" }}>
            No transactions available
          </Typography>
        )}
      </Box>

      <Dialog open={openDialog} onClose={closeCancelDialog}>
        <DialogTitle>Cancel Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for cancelling the transaction.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            type="text"
            fullWidth
            variant="standard"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog}>Nevermind</Button>
          <Button onClick={handleCancelTransaction} disabled={!cancelReason}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FreelancerHistoryPage;
