"use client";

import Header from "@/app/(components)/Header";
import { getCurrUser } from "@/utils/utils";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

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

const ClientHistory = () => {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction`,
        {
          params: { email: currUser.email },
        }
      );
      console.log(response);

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
  }, [currUser]);

  if (loading) {
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
        <CircularProgress />
      </Box>
    );
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
      <Box sx={{ padding: 2 }}>
        {transactions.length > 0 ? (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Transaction History
            </Typography>
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#2B3B4B",
                color: "#fff",
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  <Box
                    component="th"
                    sx={{ border: "1px solid #ccc", padding: 1 }}
                  >
                    Email
                  </Box>
                  <Box
                    component="th"
                    sx={{ border: "1px solid #ccc", padding: 1 }}
                  >
                    Post ID
                  </Box>
                  <Box
                    component="th"
                    sx={{ border: "1px solid #ccc", padding: 1 }}
                  >
                    Price
                  </Box>
                  <Box
                    component="th"
                    sx={{ border: "1px solid #ccc", padding: 1 }}
                  >
                    Start Date
                  </Box>
                  <Box
                    component="th"
                    sx={{ border: "1px solid #ccc", padding: 1 }}
                  >
                    End Date
                  </Box>
                  <Box
                    component="th"
                    sx={{ border: "1px solid #ccc", padding: 1 }}
                  >
                    Transaction Status
                  </Box>
                </Box>
              </Box>
              <Box component="tbody">
                {transactions.map((transaction, index) => (
                  <Box
                    component="tr"
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#1E2E3E" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{ border: "1px solid #ccc", padding: 1 }}
                    >
                      {transaction.email}
                    </Box>
                    <Box
                      component="td"
                      sx={{ border: "1px solid #ccc", padding: 1 }}
                    >
                      {transaction.post_id}
                    </Box>
                    <Box
                      component="td"
                      sx={{ border: "1px solid #ccc", padding: 1 }}
                    >
                      {transaction.price}
                    </Box>
                    <Box
                      component="td"
                      sx={{ border: "1px solid #ccc", padding: 1 }}
                    >
                      {transaction.start_date}
                    </Box>
                    <Box
                      component="td"
                      sx={{ border: "1px solid #ccc", padding: 1 }}
                    >
                      {transaction.end_date}
                    </Box>
                    <Box
                      component="td"
                      sx={{ border: "1px solid #ccc", padding: 1 }}
                    >
                      {transaction.trans_status}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6">No transactions available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ClientHistory;
