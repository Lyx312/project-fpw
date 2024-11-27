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
  IconButton
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'termsAccepted' ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    // Add your registration logic here

    const { termsAccepted, ...dataToSubmit } = formData;

    if (termsAccepted === false) {
      return
    }

    dataToSubmit.role = "freelancer";
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
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{
          p: 4,
          mt: 8,
          position: 'relative',
          borderRadius: 2,
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
  );
};

export default RegisterPage;