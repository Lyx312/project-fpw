/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/app/(components)/Header";
import { getCurrUser } from "@/utils/utils";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/app/(pages)/loading";
import { useRouter } from "next/navigation";
import ChatIcon from "@mui/icons-material/Chat";

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

  const handleCancelTransaction = async () => {
    if (!transactionToCancel) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/${transactionToCancel}/cancel`,
        {
          type: "freelancer",
          reason: cancelReason
        }
      );
      const trans = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/${transactionToCancel}`
      );
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/midtrans`, {
        transactionId: trans.data.trans_id,
        status: "refund"
      });
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

  const handleSubmitTransaction = async (transactionId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/${transactionId}/submit`
      );
      fetchUserTransaction();
      alert("Transaction submitted successfully");
    } catch (err) {
      console.error("Error submitted transaction:", err);
      alert("Failed to submitted transaction");
      setError("Failed to submitted transaction");
    }
  };

  const handleAcceptTransaction = async (transactionId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/${transactionId}/accept`,
      );
      fetchUserTransaction();
      alert("Transaction accepted successfully");
    } catch (err) {
      console.error("Error accepting transaction:", err);
      alert("Failed to accept transaction");
      setError("Failed to accept transaction");
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

  function formatDate(dateString: string): string {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    };
    return new Date(dateString).toLocaleString("en-GB", options);
  }

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
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("submitted")}>Submitted</Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("completed")}>Completed</Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("cancelled")}>Cancelled</Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("failed")}>Failed</Button>
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
                gap: 2,
                gridAutoFlow: "row dense",
                gridTemplateRows: "masonry",
                gridTemplateColumns: "repeat(3, 1fr)"
              }}
            >
              {transactions.map((transaction, index) => (
                <Card
                  key={index}
                  sx={{
                    backgroundColor: transaction.trans_status === "pending" ? "#FF3333" : "#2B3B4B",
                    color: "#fff"
                  }}
                >
                  <CardContent>
                    <Typography>Client: {transaction.user_name}</Typography>
                    <Typography>Post Title: {transaction.post_title}</Typography>
                    <Typography>Categories: {transaction.category}</Typography>
                    <Typography>
                      Price: Rp. {transaction.price.toLocaleString("id-ID")}
                    </Typography>
                    <Typography>Request: {transaction.request}</Typography>
                    <Typography>Start Date: {formatDate(transaction.start_date)}</Typography>
                    <Typography>End Date: {formatDate(transaction.end_date)}</Typography>
                    <Typography>Deadline: {formatDate(transaction.deadline)}</Typography>
                    <Typography>Status: {transaction.trans_status}</Typography>
                    {(transaction.trans_status === "cancelled" || transaction.trans_status === "failed") && (
                      <Typography>{transaction.trans_status.charAt(0).toUpperCase() + transaction.trans_status.slice(1)} Reason: {transaction.cancelled_reason}</Typography>
                    )}
                    {transaction.trans_status === 'in-progress' && transaction.start_date && transaction.deadline && (
                      <Box sx={{ width: "100%", marginTop: 2 }}>
                        <Typography variant="body2" color="white">
                          Progress: {Math.min(
                            Math.round(
                              ((new Date().getTime() - new Date(transaction.start_date).getTime()) /
                                (new Date(transaction.deadline).getTime() - new Date(transaction.start_date).getTime())) * 100
                            ),
                            100
                          )}%
                        </Typography>
                        <Box sx={{
                          width: '100%',
                          height: 10,
                          bgcolor: '#444',
                          borderRadius: 1,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{
                            width: `${Math.min(
                              ((new Date().getTime() - new Date(transaction.start_date).getTime()) /
                                (new Date(transaction.deadline).getTime() - new Date(transaction.start_date).getTime())) * 100,
                              100
                            )}%`,
                            height: '100%',
                            bgcolor: '#4C50FF',
                            transition: 'width 0.3s'
                          }} />
                        </Box>
                      </Box>
                    )}
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
                        onClick={() => handleSubmitTransaction(transaction.trans_id)}
                      >
                        Submit
                      </Button>
                    )}
                    <IconButton
                      sx={{
                        marginLeft: "auto",
                        backgroundColor: "#1A2AAA",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#1230EE" },
                        borderRadius: "8px",
                        padding: "0.5rem 1rem"
                      }}
                      onClick={() => router.push(`/chat/${transaction.user_id}`)}
                    >
                      <ChatIcon sx={{ marginRight: "0.5rem" }} />
                      <Typography variant="button" color="inherit">
                        Chat
                      </Typography>
                    </IconButton>
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
