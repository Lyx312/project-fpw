"use client";

import React, { useState } from "react";
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
  Typography,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";

interface LoginFormProps {
  onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
        formData
      );
      const data = await response.data;
      console.log(data);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundImage: "url(/assets/images/coba.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#F5EFE6", // Fallback warna krem lembut
      }}
    >
      {/* Overlay dengan efek blur */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0, 0, 0, 0.5)", // Lapisan gelap semi-transparan
          backdropFilter: "blur(10px)", // Efek blur
          zIndex: 1,
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 2, // Konten tetap di atas overlay
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            position: "relative",
            width: "100%",
            maxWidth: 400,
            mx: "auto",
            borderRadius: 4,
            bgcolor: "#FFF9F1", // Warna krem terang untuk konten
          }}
        >
          {onClose && (
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#C5AA89",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}

          <Typography
            variant="h5"
            component="h2"
            align="center"
            gutterBottom
            sx={{ color: "#6B4F4F" }}
          >
            Sign In
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
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
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "#FDF6E4",
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
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
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "#FDF6E4",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    sx={{
                      color: "#C5AA89",
                      "&.Mui-checked": { color: "#6B4F4F" },
                    }}
                  />
                }
                label="Remember me"
              />
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#6B4F4F",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
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
                bgcolor: "#D4B998",
                "&:hover": {
                  bgcolor: "#C5AA89",
                },
              }}
            >
              Login
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                display="inline"
                sx={{ color: "#6B4F4F" }}
              >
                Don't have an account?{" "}
              </Typography>
              <Link
                href="/register"
                variant="body2"
                sx={{
                  color: "#D4B998",
                  "&:hover": {
                    textDecoration: "underline",
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
