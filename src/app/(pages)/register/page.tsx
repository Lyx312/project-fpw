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
  role?: string;
  country_id?: number;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    termsAccepted: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'termsAccepted' ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);

    const { termsAccepted, ...dataToSubmit } = formData;

    if (!termsAccepted) {
      return;
    }

    dataToSubmit.role = 'freelancer';
    dataToSubmit.country_id = 1;
    console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/api`);

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
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: 'url(/assets/images/coba.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#F5EFE6', // Fallback warna krem lembut
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.5)', // Lapisan gelap semi-transparan
          backdropFilter: 'blur(10px)', // Efek blur
          zIndex: 1,
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 2, // Konten tetap di atas overlay
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: '#FFF9F1', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#C5AA89',
            }}
          > */}
            {/* <CloseIcon /> */}
          {/* </IconButton> */}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ color: '#6B4F4F', fontWeight: 'bold' }}
            >
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
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#FDF6E4',
                  },
                }}
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
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#FDF6E4',
                  },
                }}
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
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  bgcolor: '#FDF6E4',
                },
              }}
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
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  bgcolor: '#FDF6E4',
                },
              }}
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
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  bgcolor: '#FDF6E4',
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  color="primary"
                  sx={{
                    color: '#C5AA89',
                    '&.Mui-checked': { color: '#6B4F4F' },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#6B4F4F' }}>
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
                bgcolor: '#D4B998',
                color: 'black',
                '&:hover': {
                  bgcolor: '#C5AA89',
                },
              }}
            >
              Register
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" display="inline" sx={{ color: '#6B4F4F' }}>
                Already have an account?{' '}
              </Typography>
              <Link
                href="/login"
                variant="body2"
                underline="hover"
                sx={{
                  color: '#D4B998',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
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
