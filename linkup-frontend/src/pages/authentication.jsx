import * as React from "react";
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Snackbar, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Footer from '../components/Footer';
// 1. Changed import to useAuth
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

const defaultTheme = createTheme();

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0); // 0: Login, 1: Register
    const [open, setOpen] = React.useState(false);

    // 2. Swapped React.useContext for the new custom hook
    const { handleRegister, handleLogin } = useAuth();

    const handleAuth = async () => {
        try {
            setError("");
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                const result = await handleRegister(name, username, email, password);
                setUsername(""); setPassword(""); setName(""); setEmail("");
                setMessage(result);
                setOpen(true);
                setFormState(0);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Authentication failed.";
            setError(msg);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box className="auth-page-centered">
                <CssBaseline />
                
                <Paper elevation={10} className="auth-card">
                    <Box className="auth-form-container">
                        <Avatar 
                            src="/Logo.png" 
                            alt="LinkUp Logo" 
                            sx={{ width: 80, height: 80, mb: 2, bgcolor: "transparent" }} 
                        />

                        <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                            LinkUp Authentication
                        </Typography>

                        {error && <p className="auth-error">{error}</p>}

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

                        <Box component="form" noValidate className="auth-form">
                            {formState === 1 && (
                                <>
                                    <TextField
                                        margin="normal" required fullWidth label="Full Name"
                                        value={name} onChange={(e) => setName(e.target.value)}
                                    />
                                    <TextField
                                        margin="normal" required fullWidth label="Email Address"
                                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </>
                            )}

                            <TextField
                                margin="normal" required fullWidth label="Username"
                                value={username} onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal" required fullWidth label="Password"
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                type="button" fullWidth variant="contained" className="auth-submit-btn"
                                onClick={handleAuth}
                                disabled={!username || !password || (formState === 1 && (!name || !email))}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>

                            <Box className="auth-divider">
                                <Typography variant="body2" color="text.secondary">OR</Typography>
                            </Box>

                            <Button
                                className="google-btn" 
                                fullWidth 
                                variant="outlined"
                                startIcon={<GoogleIcon />} 
                                onClick={() => window.location.href = "https://linkup-c1fx.onrender.com/auth/google"}
                            >
                                Continue with Google
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                <Footer />

                <Snackbar
                    open={open} autoHideDuration={4000} message={message}
                    onClose={() => setOpen(false)}
                />
            </Box>

            
        </ThemeProvider>
    );
}