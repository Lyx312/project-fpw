/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/app/(components)/Header";
import { getCurrUser } from "@/utils/utils";
import { Box, Typography, Paper, Button, ButtonGroup } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/app/(pages)/loading";

interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  gender: string;
  country_id: string;
  balance: number;
  exp: number;
  pfp_path: string;
}

const FreelancerHistoryPage = () => {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

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
          balance: user.balance as number,
          pfp_path: user.pfp_path as string,
          exp: user.exp as number,
        });
      } else {
        console.log("No user found");
        setCurrUser(null);
      }
    } catch (err) {
      setError("Failed to fetch user data");
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
          width: '100%',
          display: 'flex',
          marginBottom: 1
        }}
      >
        <Button sx={{ flex: 1 }} onClick={() => setFilterStatus('')}>All</Button>
        <Button sx={{ flex: 1 }} onClick={() => setFilterStatus('pending')}>Pending</Button>
        <Button sx={{ flex: 1 }} onClick={() => setFilterStatus('in-progress')}>In Progress</Button>
        <Button sx={{ flex: 1 }} onClick={() => setFilterStatus('completed')}>Completed</Button>
        <Button sx={{ flex: 1 }} onClick={() => setFilterStatus('paid')}>Paid</Button>
        <Button sx={{ flex: 1 }} onClick={() => setFilterStatus('cancelled')}>Cancelled</Button>
      </ButtonGroup>

        {transactions.length > 0 ? (
          <Box>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 600, color: "#fff" }}>
              Transaction History
            </Typography>
            <Paper sx={{ overflow: "hidden", backgroundColor: "#2B3B4B" }}>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  borderCollapse: "collapse",
                  color: "#fff",
                  "& th, td": {
                    padding: "10px 15px",
                    border: "1px solid #444",
                  },
                  "& th": {
                    backgroundColor: "#3B4A5D",
                    fontWeight: 600,
                  },
                  "& tr:nth-of-type(odd)": {
                    backgroundColor: "#1E2E3E",
                  },
                  "& tr:hover": {
                    backgroundColor: "#35495e",
                  },
                }}
              >
                <Box component="thead">
                  <Box component="tr">
                    <Box component="th">Email</Box>
                    <Box component="th">Post ID</Box>
                    <Box component="th">Price</Box>
                    <Box component="th">Start Date</Box>
                    <Box component="th">End Date</Box>
                    <Box component="th">Transaction Status</Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {transactions.map((transaction, index) => (
                    <Box component="tr" key={index}>
                      <Box component="td">{transaction.email}</Box>
                      <Box component="td">{transaction.post_id}</Box>
                      <Box component="td">{transaction.price}</Box>
                      <Box component="td">{transaction.start_date}</Box>
                      <Box component="td">{transaction.end_date}</Box>
                      <Box component="td">{transaction.trans_status}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ color: "#fff" }}>No transactions available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default FreelancerHistoryPage;
