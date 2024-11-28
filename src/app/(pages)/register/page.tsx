'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Paper,
  Link,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  termsAccepted: boolean;
  role: string;
  country_id: string;
  file?: File | null;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    termsAccepted: false,
    role: '',
    country_id: '',
    file: null,
  });

  const countries = [
    { id: '1', name: 'United States' },
    { id: '2', name: 'Indonesia' },
    { id: '3', name: 'Japan' },
    { id: '4', name: 'Germany' },
    { id: '5', name: 'India' },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'termsAccepted' ? checked : value,
    }));
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({
      ...prev,
      role: event.target.value as string,
    }));
  };

  const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({
      ...prev,
      country_id: event.target.value as string,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        file: event.target.files[0],
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);

    const { termsAccepted, file, ...dataToSubmit } = formData;

    if (!termsAccepted) {
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/register`, dataToSubmit);
      const data = await response.data;
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/assets/images/coba.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay untuk gelap
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi transparan
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h5" align="center" gutterBottom>
              Sign Up
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                required
                value={formData.first_name}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                required
                value={formData.last_name}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Box>

            <TextField
              name="email"
              label="Email Address"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              name="phone"
              label="Phone Number"
              fullWidth
              required
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              select
              name="country_id"
              label="Country"
              fullWidth
              required
              value={formData.country_id}
              onChange={handleCountryChange}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            >
              {countries.map(country => (
                <MenuItem key={country.id} value={country.id}>
                  {country.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              name="role"
              label="Role"
              fullWidth
              required
              value={formData.role}
              onChange={handleRoleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="freelancer">Freelancer</MenuItem>
            </TextField>

            {formData.role === 'freelancer' && (
              <TextField
                name="file"
                type="file"
                onChange={handleFileChange}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                inputProps={{ accept: 'application/pdf, image/*' }}
              />
            )}

            <FormControlLabel
              control={
                <Checkbox
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to Terms & Conditions
                </Typography>
              }
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mb: 2,
                bgcolor: '#E6D5B8',
                color: 'black',
                '&:hover': {
                  bgcolor: '#d4c4a7',
                },
              }}
            >
              Register
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" display="inline">
                Already have an account?{' '}
              </Typography>
              <Link href="/login" variant="body2" underline="hover">
                Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
