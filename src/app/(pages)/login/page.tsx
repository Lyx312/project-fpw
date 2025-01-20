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
} from "@mui/icons-material";
import axios from "axios";
import Header from "@/app/(components)/Header";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  setPassword,
  setRememberMe,
  setLoading,
  resetForm,
} from "../../redux/slices/authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { email, password, rememberMe, isLoading } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;

    if (name === "email") dispatch(setEmail(value));
    if (name === "password") dispatch(setPassword(value));
    if (name === "rememberMe") dispatch(setRememberMe(checked));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
        { email, password, rememberMe }
      );
      const data = await response.data;
      console.log(data);
      alert("Login successful");
      dispatch(resetForm());
      if (data.user.role == "admin") {
        router.push("/admin");
      }
      else{
        router.push("/");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.error);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundImage: 'url(/assets/images/background-login-register.jpg)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#F5EFE6",
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

        <Container
          maxWidth="sm"
          sx={{
            position: "relative",
            zIndex: 2,
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
              bgcolor: "#FFF9F1",
            }}
          >
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
                value={email}
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
                value={password}
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
                      checked={rememberMe}
                      onChange={handleChange}
                      sx={{
                        color: "#C5AA89",
                        "&.Mui-checked": { color: "#6B4F4F" },
                      }}
                    />
                  }
                  label="Remember me"
                />
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
                  Don&apos;t have an account?{" "}
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
    </>
  );
};

export default LoginForm;
