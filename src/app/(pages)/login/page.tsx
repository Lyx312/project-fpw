'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon
} from '@mui/icons-material';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await onSubmit(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/assets/images/coba.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          {onClose && (
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8
              }}
            >
              <CloseIcon />
            </IconButton>
          )}

          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                mb: 2
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link href="#" variant="body2" color="primary">
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                bgcolor: '#D4B998',
                '&:hover': {
                  bgcolor: '#C5AA89',
                },
              }}
            >
              Login
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" display="inline">
                Dont have an account?{' '}
              </Typography>
              <Link
                href="/register"
                variant="body2"
                sx={{
                  color: '#D4B998',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Register
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;