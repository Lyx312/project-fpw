'use client';

import React, { useEffect, useState } from 'react';
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
  Autocomplete,
  InputAdornment,
  Select,
  FormControl,
  Chip,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Header from '@/app/(components)/Header';
import { baseUrl } from '@/config/url';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  termsAccepted: boolean;
  role: string;
  country_id: string;
  file?: File | null;
  cv_path?: string;
  categories: string[];
}

interface Category {
  _id: string;
  category_id: number;
  category_name: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    termsAccepted: false,
    role: '',
    country_id: '',
    file: null,
    cv_path: '',
    categories: [],
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  interface Country {
    country_id: string;
    country_name: string;
  }

  const [countries, setCountries] = useState<Country[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/country`);
        setCountries(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/category`);
        setAllCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    const checked = (event.target as HTMLInputElement).checked;
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

  const handleCountryChange = (event: React.ChangeEvent<unknown>, value: Country | null) => {
    setFormData(prev => ({
      ...prev,
      country_id: value ? value.country_id : '',
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        file: event.target.files ? event.target.files[0] : null,
      }));
    }
  };

  const addToList = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
    }
  };

  const removeFromList = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((i) => i !== item));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);

    const { termsAccepted, file, ...dataToSubmit } = formData;

    if (!termsAccepted) {
      alert('Please accept the terms & conditions');
      return;
    }

    try {
      if (formData.role === 'freelancer') {
        if (!file) {
          alert('Please upload your CV');
          return;
        }
        const formData = new FormData();
        formData.append('file', file as Blob, `${dataToSubmit.email}.pdf`);
        formData.append('type', 'cvs');

        const uploadResponse = await axios.post(`${baseUrl}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        dataToSubmit.cv_path = uploadResponse.data.blob.url;
      }

      const response = await axios.post(`${baseUrl}/api/register`, dataToSubmit);
      const data = await response.data;
      console.log(data);

      alert('Registration successful. Please check your email to verify your account');
      router.push('/login');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message);
      } else {
        console.error(error);
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'url(/assets/images/background-login-register.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            zIndex: 1,
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
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
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

              <TextField
                name="confirm_password"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                required
                value={formData.confirm_password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Autocomplete
                options={countries}
                getOptionLabel={(option) => option.country_name}
                onChange={handleCountryChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    fullWidth
                    required
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}
              />

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
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="freelancer">Freelancer</MenuItem>
              </TextField>

              {formData.role === 'freelancer' && (
                <>
                  <Box>
                    <Typography variant="subtitle1">
                      Upload CV
                    </Typography>
                    <TextField
                      name="file"
                      type="file"
                      onChange={handleFileChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                      inputProps={{ accept: 'application/pdf' }}
                    />
                  </Box>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      Categories
                    </Typography>
                    <Select
                      value=""
                      displayEmpty
                      onChange={(e) => {
                        addToList(e.target.value as string, formData.categories, (categories) => setFormData(prev => ({ ...prev, categories: categories as string[] })));
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select a category
                      </MenuItem>
                      {allCategories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                      {formData.categories.map((category) => (
                        <Chip
                          key={category}
                          label={allCategories.find((cat) => cat._id === category)?.category_name}
                          onDelete={() => removeFromList(category, formData.categories, (categories) => setFormData(prev => ({ ...prev, categories: categories as string[] })))}
                          sx={{ backgroundColor: "#d1ca97" }} 
                        />
                      ))}
                    </Box>
                  </FormControl>
                </>
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
    </>
  );
};

export default RegisterPage;