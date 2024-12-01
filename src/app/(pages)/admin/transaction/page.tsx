'use client'
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, LinearProgress } from '@mui/material';

interface Transaction {
  trans_id: number;
  email: string;
  post_id: number;
  price: number;
  start_date: string;
  end_date: string;
  trans_status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const colors = {
  primary: '#001F3F',
  secondary: '#3A6D8C',
  accent: '#6A9AB0',
  text: '#EAD8B1',
};

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState({
    trans_id: '',
    email: '',
    trans_status: '',
    start_date: '',
    end_date: '',
    min_price: '',
    max_price: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/transaction?${query}`);
    if (response.ok) {
      const data = await response.json();
      setTransactions(data);
    } else {
      console.error('Error fetching transactions');
    }
    setLoading(false);
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
        minHeight: '100vh',
        backgroundColor: colors.primary,
        color: colors.text,
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Transaction List
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text }}>
            View and manage all transactions with their associated data.
          </Typography>
        </Box>

        {/* Filters */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: colors.accent,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <TextField
              label="Transaction ID"
              variant="outlined"
              value={filters.trans_id}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              name="trans_id"
            />
            <TextField
              label="Email"
              variant="outlined"
              value={filters.email}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              name="email"
            />
            <TextField
              label="Transaction Status"
              variant="outlined"
              value={filters.trans_status}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              name="trans_status"
            />
            <TextField
              label="Start Date"
              variant="outlined"
              value={filters.start_date}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              name="start_date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              variant="outlined"
              value={filters.end_date}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              name="end_date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Min Price"
              variant="outlined"
              value={filters.min_price}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              name="min_price"
              type="number"
            />
            <TextField
              label="Max Price"
              variant="outlined"
              value={filters.max_price}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              name="max_price"
              type="number"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchTransactions}
              sx={{ backgroundColor: colors.secondary }}
            >
              Apply Filters
            </Button>
          </Box>
        </Paper>

        {/* Loading Indicator */}
        {loading && <LinearProgress />}

        {/* Transactions Table */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: colors.accent,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Transactions List
          </Typography>
          {transactions.length === 0 ? (
            <Typography>No transactions found</Typography>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="transactions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Post ID</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Deleted At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.trans_id}>
                      <TableCell>{transaction.trans_id}</TableCell>
                      <TableCell>{transaction.email}</TableCell>
                      <TableCell>{transaction.post_id}</TableCell>
                      <TableCell>{transaction.price}</TableCell>
                      <TableCell>{new Date(transaction.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(transaction.end_date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.trans_status}</TableCell>
                      <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.updatedAt ? new Date(transaction.updatedAt).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{transaction.deletedAt ? new Date(transaction.deletedAt).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default TransactionPage;
