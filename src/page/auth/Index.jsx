import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "../../store/apiCall/auth";
import Page from "../../components/helmet/Page";

// -------------------------
// Validation Schema (Yup)
// -------------------------
const schema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required."),
  password: yup.string().required("Password is required."),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const redirectTo = location.state?.from?.pathname || "/app/projects";

  // -------------------------
  // React Hook Form Setup
  // -------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // -------------------------
  // Submit Handler
  // -------------------------
  const onSubmit = (data) => {
    dispatch(login(data, setLoading, () => {
      navigate(redirectTo, { replace: true });
    }));

  };

  return (
    <Page title="Login">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 400,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={1}>
            Welcome Back
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to continue
          </Typography>

          {/* ------------------------- */}
          {/* Form */}
          {/* ------------------------- */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              size="small"
              label="Email*"
              fullWidth
              margin="normal"
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              size="small"
              label="Password*"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              loading={loading}
              size="large"
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Login
            </Button>
          </form>

          <Box mt={2} textAlign="center">
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", color: "primary.main", display: "none" }}
            // onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Page>
  );
}
