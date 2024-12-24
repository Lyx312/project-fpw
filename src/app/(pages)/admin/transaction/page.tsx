'use client';
import { useEffect, useState } from 'react';
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
} from '@mui/material';

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
}

const colors = {
  primary: '#001F3F',
  secondary: '#3A6D8C',
  accent: '#6A9AB0',
  text: '#EAD8B1',
  background: '#f5f5f5',
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
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    try {
      const response = await fetch(`/api/transaction?${query}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
        setTransactions(data);
      } else {
        console.error('Error fetching transactions');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
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

        {/* Filters Section */}
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
            {[
              { label: 'Transaction ID', name: 'trans_id', type: 'text' },
              { label: 'Email', name: 'email', type: 'text' },
              { label: 'Transaction Status', name: 'trans_status', type: 'text' },
              { label: 'Start Date', name: 'start_date', type: 'date' },
              { label: 'End Date', name: 'end_date', type: 'date' },
              { label: 'Min Price', name: 'min_price', type: 'number' },
              { label: 'Max Price', name: 'max_price', type: 'number' },
            ].map((filter, index) => (
              <TextField
                key={index}
                label={filter.label}
                variant="outlined"
                value={filters[filter.name as keyof typeof filters]}
                onChange={handleChange}
                name={filter.name}
                type={filter.type}
                InputLabelProps={filter.type === 'date' ? { shrink: true } : undefined}
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
                '&:hover': { backgroundColor: '#2A5C73' },
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
            borderRadius: '8px',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Transactions List
          </Typography>
          {transactions.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              No transactions found.
            </Typography>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="transactions table">
                <TableHead>
                  <TableRow>
                    {[
                      'Transaction ID',
                      'Email',
                      'Post ID',
                      'Price',
                      'Category',
                      'Start Date',
                      'End Date',
                      'Status',
                      'Created At',
                      'Updated At',
                      'Deleted At',
                    ].map((header, index) => (
                      <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.trans_id}>
                      <TableCell>{transaction.trans_id}</TableCell>
                      <TableCell>{transaction.email}</TableCell>
                      <TableCell>{transaction.post_id}</TableCell>
                      <TableCell>{transaction.price}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{transaction.start_date ? new Date(transaction.start_date).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>{transaction.end_date ? new Date(transaction.end_date).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>{transaction.trans_status}</TableCell>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {transaction.updatedAt
                          ? new Date(transaction.updatedAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {transaction.deletedAt
                          ? new Date(transaction.deletedAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
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
