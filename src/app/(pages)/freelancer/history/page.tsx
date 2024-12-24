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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
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
  const [postDetails, setPostDetails] = useState<{ [key: string]: any }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Track selected category
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [transactionToCancel, setTransactionToCancel] = useState<string | null>(
    null
  );

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
<<<<<<< HEAD
      const transactionsWithCategories = response.data;

      // Fetch post details for each transaction and add categories to each transaction
      for (const transaction of transactionsWithCategories) {
        if (transaction.post_id && !postDetails[transaction.post_id]) {
          const postDetail = await fetchUserPost(transaction.post_id);
          if (postDetail) {
            // Include the categories from the post details into each transaction
            transaction.categories = postDetail.categories || [];

            setPostDetails((prevDetails) => ({
              ...prevDetails,
              [transaction.post_id]: postDetail,
            }));
          }
        }
      }

      setTransactions(transactionsWithCategories);

      // Update categories state
      const allCategories = transactionsWithCategories.flatMap(
        (transaction) => transaction.categories
      );
      setCategories((prevCategories) => {
        const uniqueCategories = new Set([...prevCategories, ...allCategories]);
        return Array.from(uniqueCategories);
      });

      // Initialize filteredTransactions to all transactions initially
      setFilteredTransactions(transactionsWithCategories);
=======
      console.log(response.data);
      
      setTransactions(response.data);
>>>>>>> 725f141d0d3fdeaa168aa19e0e9ea237f3500329
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions");
    }
  };

  const fetchUserPost = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching Post", error);
      setError && setError("Failed to fetch Post");
    }
  };

  const handleCategoryClick = (category: string) => {
    // Set the selected category to filter the transactions
    setSelectedCategory(category);

    // Filter transactions based on the selected category
    const filtered = transactions.filter((transaction) =>
      transaction.categories.includes(category)
    );

    setFilteredTransactions(filtered);
  };

  function formatDate(dateString: string): string {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    };
    return new Date(dateString).toLocaleString("en-US", options);
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
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("")}>
            All
          </Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("pending")}>
            Pending
          </Button>
          <Button
            sx={{ flex: 1 }}
            onClick={() => setFilterStatus("in-progress")}
          >
            In Progress
          </Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("completed")}>
            Completed
          </Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("paid")}>
            Paid
          </Button>
          <Button sx={{ flex: 1 }} onClick={() => setFilterStatus("cancelled")}>
            Cancelled
          </Button>
        </ButtonGroup>

        {filteredTransactions.length > 0 ? (
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
              {filteredTransactions.map((transaction, index) => (
                <Card
                  key={index}
                  sx={{ backgroundColor: "#2B3B4B", color: "#fff" }}
                >
                  <CardContent>
                    <Typography>Client: {transaction.user_name}</Typography>
                    <Typography>
                      Post Title: {transaction.post_title}
                    </Typography>
                    <Typography>Price: {transaction.price}</Typography>
<<<<<<< HEAD
                    <Typography>
                      Start Date: {transaction.start_date}
                    </Typography>
                    <Typography>End Date: {transaction.end_date}</Typography>
=======
                    <Typography>Start Date: {formatDate(transaction.start_date)}</Typography>
                    <Typography>End Date: {formatDate(transaction.end_date)}</Typography>
>>>>>>> 725f141d0d3fdeaa168aa19e0e9ea237f3500329
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
                      onClick={() =>
                        router.push(`/posts/detail/${transaction.post_id}`)
                      }
                    >
                      View Post
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>

            <Box sx={{ marginTop: 4 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#fff", marginBottom: 2 }}
              >
                Categories
              </Typography>
              {categories.length > 0 ? (
                <List>
                  {categories.map((category, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        backgroundColor: "#2B3B4B",
                        marginBottom: 1,
                        cursor: "pointer", // Make it look clickable
                      }}
                      onClick={() => handleCategoryClick(category)} // Click handler for category
                    >
                      <ListItemText primary={category} sx={{ color: "#fff" }} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ color: "#fff" }}>
                  No categories available
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ color: "#fff" }}>
            No transactions available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FreelancerHistoryPage;
