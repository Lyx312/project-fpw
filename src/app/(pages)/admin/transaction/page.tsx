"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  LinearProgress,
} from "@mui/material";
import axios from "axios";

interface Transaction {
  trans_id: number;
  email: string;
  post_id: number;
  price: number;
  category: string;
  start_date: string;
  end_date: string;
  trans_status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categories: string[];
}

const colors = {
  primary: "#001F3F",
  secondary: "#3A6D8C",
  accent: "#6A9AB0",
  text: "#EAD8B1",
  background: "#f5f5f5",
};

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState({
<<<<<<< HEAD
    trans_id: "",
    email: "",
    trans_status: "",
    start_date: "",
    end_date: "",
    min_price: "",
    max_price: "",
=======
    trans_id: '',
    email: '',
    trans_status: '',
    start_date: '',
    end_date: '',
    min_price: '',
    max_price: '',
    role: 'admin'
>>>>>>> 725f141d0d3fdeaa168aa19e0e9ea237f3500329
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    try {
      const response = await fetch(`/api/transaction?${query}`);
      if (response.ok) {
        const data = await response.json();
<<<<<<< HEAD
        const transactionsWithCategories = data;

        for (const transaction of transactionsWithCategories) {
          if (transaction.post_id) {
            const postDetail = await fetchUserPost(transaction.post_id);
            if (postDetail) {
              transaction.categories = postDetail.categories || [];
            }
          }
        }

        // Group transactions by categories
        const groupedByCategory = groupTransactionsByCategory(
          transactionsWithCategories
        );
        setTransactions(groupedByCategory);
=======
        console.log(data);
        
        setTransactions(data);
>>>>>>> 725f141d0d3fdeaa168aa19e0e9ea237f3500329
      } else {
        console.error("Error fetching transactions");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
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

  const groupTransactionsByCategory = (transactions: Transaction[]) => {
    const grouped: Record<string, Transaction[]> = {};
    transactions.forEach((transaction) => {
      transaction.categories.forEach((category) => {
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(transaction);
      });
    });
    return grouped;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.primary,
        color: colors.text,
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Transaction List
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text }}>
            View and manage all transactions with their associated data.
          </Typography>
        </Box>

        {/* Filters Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: colors.accent,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            {[
              { label: "Transaction ID", name: "trans_id", type: "text" },
              { label: "Email", name: "email", type: "text" },
              {
                label: "Transaction Status",
                name: "trans_status",
                type: "text",
              },
              { label: "Start Date", name: "start_date", type: "date" },
              { label: "End Date", name: "end_date", type: "date" },
              { label: "Min Price", name: "min_price", type: "number" },
              { label: "Max Price", name: "max_price", type: "number" },
            ].map((filter, index) => (
              <TextField
                key={index}
                label={filter.label}
                variant="outlined"
                value={filters[filter.name as keyof typeof filters]}
                onChange={handleChange}
                name={filter.name}
                type={filter.type}
                InputLabelProps={
                  filter.type === "date" ? { shrink: true } : undefined
                }
                sx={{ flex: 1, minWidth: 200 }}
              />
            ))}
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchTransactions}
              sx={{
                backgroundColor: colors.secondary,
                color: colors.text,
                "&:hover": { backgroundColor: "#2A5C73" },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Paper>

        {/* Loading Indicator */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Transactions Table */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: colors.background,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
            Transactions List
          </Typography>
          {Object.keys(transactions).length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              No transactions found.
            </Typography>
          ) : (
            Object.entries(transactions).map(
              ([category, categoryTransactions]) => (
                <Box key={category} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Category: {category}
                  </Typography>
                  <TableContainer>
                    <Table
                      sx={{ minWidth: 650 }}
                      aria-label="transactions table"
                    >
                      <TableHead>
                        <TableRow>
                          {[
                            "Transaction ID",
                            "Email",
                            "Post ID",
                            "Price",
                            "Start Date",
                            "End Date",
                            "Status",
                            "Created At",
                            "Updated At",
                            "Deleted At",
                            "Categories",
                          ].map((header, index) => (
                            <TableCell key={index} sx={{ fontWeight: "bold" }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categoryTransactions.map((transaction) => (
                          <TableRow key={transaction.trans_id}>
                            <TableCell>{transaction.trans_id}</TableCell>
                            <TableCell>{transaction.email}</TableCell>
                            <TableCell>{transaction.post_id}</TableCell>
                            <TableCell>{transaction.price}</TableCell>
                            <TableCell>
                              {transaction.start_date
                                ? new Date(
                                    transaction.start_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {transaction.end_date
                                ? new Date(
                                    transaction.end_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>{transaction.trans_status}</TableCell>
                            <TableCell>
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {transaction.updatedAt
                                ? new Date(
                                    transaction.updatedAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {transaction.deletedAt
                                ? new Date(
                                    transaction.deletedAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {transaction.categories.join(", ")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )
            )
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default TransactionPage;
