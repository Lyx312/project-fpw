/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  country_name: string;
  balance: number;
  role: string;
}

interface Country {
  country_id: number;
  country_name: string;
}

const colors = {
  primary: '#001F3F',
  secondary: '#3A6D8C',
  accent: '#6A9AB0',
  text: '#EAD8B1',
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const fetchUsers = async () => {
      setLoading(true);
      try {
          const params: Record<string, string> = {};
          if (nameFilter) params.name = nameFilter;
          if (countryFilter) params.country = countryFilter;
          if (roleFilter) params.role = roleFilter;
  
          const response = await axios.get('/api/userCountry', { params });
          setUsers(response.data);
      } catch (err) {
          console.error('Error fetching users:', err);
      } finally {
          setLoading(false);
      }
  };

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/country');
      if (!response.ok) {
        throw new Error(`Error fetching countries: ${response.status}`);
      }
      const data = await response.json();
      setCountries(data.data || []);
    } catch (err: any) {
      console.error(err.message);
      setError('Failed to fetch countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchUsers();
}, [nameFilter, countryFilter, roleFilter]);

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
            Manage Users
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text }}>
            View and manage all users with their associated data.
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
              label="Name or Email"
              variant="outlined"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <FormControl sx={{ flex: 1, minWidth: 200 }} variant="outlined">
              <InputLabel>Country</InputLabel>
              <Select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                label="Country"
              >
                <MenuItem value="">
                  <em>All Countries</em>
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.country_id} value={country.country_id}>
                    {country.country_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1, minWidth: 200 }} variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role"
              >
                <MenuItem value="">
                  <em>All Roles</em>
                </MenuItem>
                <MenuItem value="freelancer">Freelancer</MenuItem>
                <MenuItem value="client">Client</MenuItem>
              </Select>
            </FormControl>
            {/* <Button
              variant="contained"
              color="secondary"
              onClick={handleFilterSubmit}
              sx={{ backgroundColor: colors.secondary }}
            >
              Apply Filters
            </Button> */}
          </Box>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>

        {/* Users Table */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: colors.accent,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Users List
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress color="inherit" />
            </Box>
          ) : users.length === 0 ? (
            <Typography>No users found</Typography>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                      <TableCell>{user.country_name}</TableCell>
                      <TableCell>{user.balance}</TableCell>
                      <TableCell>{user.role}</TableCell>
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

export default AdminUsersPage;
