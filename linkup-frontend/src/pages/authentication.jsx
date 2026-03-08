import * as React from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { AuthContext } from "../contexts/AuthContext";
import "../App.css";

const defaultTheme = createTheme();

export default function Authentication() {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState(""); // Added email state

  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {

    try {
      setError("");

      if (formState === 0) {
        await handleLogin(username, password);
      }

      if (formState === 1) {
        // Pass email to your context handler
        const result = await handleRegister(name, username, email, password);
        console.log(result);

        setUsername("");
        setPassword("");
        setName("");
        setEmail(""); // Clear email on success

        setMessage(result);
        setOpen(true);

        setFormState(0);
      }

    } catch (err) {
      console.log(err);
      const message =
        err?.response?.data?.message ||
        "Authentication failed. Please try again.";

      setError(message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" className="auth-page">

        <CssBaseline />

        {/* Left Background Section */}
        <Grid
          item
          xs={12}
          md={7}
          className="auth-background"
          sx={{ 
            display: { xs: 'none', md: 'block' }
          }}
        />

        {/* Right Form Section */}
        <Grid
          item
          xs={12}
          md={5}
          component={Paper}
          elevation={6}
          square
          className="auth-panel"
        >

          <Box className="auth-form-container">

            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              LinkUp Authentication
            </Typography>

            {/* Error */}
            <p className="auth-error">{error}</p>

            {/* Toggle Buttons */}
            <Box className="auth-toggle">
              <Button
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => setFormState(0)}
              >
                Sign In
              </Button>

              <Button
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => setFormState(1)}
              >
                Sign Up
              </Button>
            </Box>

            {/* Form */}
            <Box component="form" noValidate className="auth-form">

              {formState === 1 && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="fullname"
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Typography className="auth-error">
                  {error}
                </Typography>
              )}

              <Button
                type="button"
                fullWidth
                variant="contained"
                className="auth-submit-btn"
                onClick={handleAuth}
                // Updated disabled logic to account for email and name
                disabled={!username || !password || (formState === 1 && (!name || !email))}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>

              {/* Divider */}
              <Box className="auth-divider">
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Box>

              {/* Google Login */}
              <Button
                className="google-btn"
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </Button>

            </Box>

          </Box>
        </Grid>

      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
        onClose={() => setOpen(false)}
      />

    </ThemeProvider>
  );
}