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
  Button,
  Link,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
  DialogTitle
} from '@mui/material';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  country_name: string;
  role: string;
  is_banned: boolean;
  banned_reason: string | null;
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
  paperBackground: '#f5f5f5',
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banned, setBanned] = useState(false);
  const [banUser, setBanUser] = useState<string | null>(
    null
  );

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
    }
  };

  const openCancelDialog = (user: User) => {
    setBanUser(user._id);
    setBanned(user.is_banned);
    setOpenDialog(true);
  };

  const closeCancelDialog = () => {
    setOpenDialog(false);
    setBanReason("");
    setBanUser(null);
    setBanned(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [nameFilter, countryFilter, roleFilter]);

  const handleBanUnban = async () => {
    if (!banUser) return;
    try {
      if (banned) {
        await axios.put(`/api/users/${banUser}/ban`, {reason: null });
      }
      else{
        await axios.put(`/api/users/${banUser}/ban`, {reason: banReason });
      }
      fetchUsers();
      setOpenDialog(false);
      setBanReason("");
      setBanUser(null);
    } catch (err) {
      console.error('Error banning/unbanning user:', err);
    }
  };

  const handleUnban = async (user: User) => {
    try {
        await axios.put(`/api/users/${user._id}/ban`);
      fetchUsers();
    } catch (err) {
      console.error('Error banning/unbanning user:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.primary,
        color: colors.text,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Manage Users
          </Typography>
          <Typography variant="body1">
            View and manage all users with their associated data.
          </Typography>
        </Box>

        {/* Filters */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: colors.paperBackground,
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
            backgroundColor: colors.paperBackground,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Users List
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress color="primary" />
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
                    <TableCell>Role</TableCell>
                    <TableCell align="center">Actions</TableCell>
                    <TableCell align="center">Banned Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>
                        <Link href={`/profile/${user._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography variant="body2" sx={{ cursor: 'pointer'}}>
                            {user.email}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                      <TableCell>{user.country_name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell align="center">
                      <Button
                        variant="contained"
                        color={user.is_banned ? 'error' : 'success'}
                        onClick={() => {
                          if (user.is_banned) {
                            handleUnban(user);
                          } else {
                            openCancelDialog(user);
                          }
                        }}
                      >
                        {user.is_banned ? 'Unban' : 'Ban'}
                      </Button>
                      </TableCell>
                      <TableCell align="center">{user.banned_reason
                          ? user.banned_reason
                          : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
      <Dialog open={openDialog} onClose={closeCancelDialog}>
        <DialogTitle>Ban User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for banning this user.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            type="text"
            fullWidth
            variant="standard"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog}>Nevermind</Button>
          <Button onClick={handleBanUnban} disabled={!banReason}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;
