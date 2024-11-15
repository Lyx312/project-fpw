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

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  termsAccepted: boolean;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    // Add your registration logic here
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
              name="firstName"
              label="First Name"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              required
              value={formData.lastName}
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
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            required
            value={formData.phoneNumber}
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
            <Link href="#" variant="body2" underline="hover">
              Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;