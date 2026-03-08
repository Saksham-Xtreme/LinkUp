import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, TextField, Typography, Box, Paper, Grid } from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import KeyboardIcon from "@mui/icons-material/Keyboard";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomCode, setRoomCode] = useState("");

  // 1. Catch Google Auth Token (From our earlier setup)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home", { replace: true });
    }
  }, [location, navigate]);

  // 2. Generate a random meeting room URL and navigate to it
  const handleCreateMeeting = () => {
    // Generates a random 8-character string (e.g., "x7b9a2kq")
    const newRoomCode = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${newRoomCode}`);
  };

  // 3. Join an existing meeting via user input
  const handleJoinMeeting = () => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.trim()}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#f8f9fa", display: "flex", flexDirection: "column" }}>
      
      {/* Top Navigation Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, backgroundColor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a73e8" }}>
          LinkUp
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Main Content Area */}
      <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: "center", p: 3 }}>
        <Grid item xs={12} md={6} lg={5}>
          <Paper elevation={0} sx={{ p: 5, borderRadius: 4, backgroundColor: "transparent" }}>
            
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: "#202124" }}>
              Premium video meetings. <br/> Now free for everyone.
            </Typography>
            
            <Typography variant="body1" sx={{ color: "#5f6368", mb: 5, fontSize: "1.1rem" }}>
              Connect, collaborate, and celebrate from anywhere with LinkUp.
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
              
              {/* Start Meeting Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<VideoCallIcon />}
                onClick={handleCreateMeeting}
                sx={{ backgroundColor: "#1a73e8", py: 1.5, px: 3, fontSize: "1rem", borderRadius: 2 }}
              >
                New Meeting
              </Button>

              {/* Join Meeting Input */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, backgroundColor: "#fff", px: 2, borderRadius: 2, border: "1px solid #dadce0" }}>
                <KeyboardIcon sx={{ color: "#5f6368" }} />
                <TextField
                  variant="standard"
                  placeholder="Enter a code or link"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{ py: 1.5, width: "200px" }}
                />
              </Box>

              {/* Join Button (Only shows if typing) */}
              {roomCode && (
                <Button 
                  variant="text" 
                  size="large" 
                  onClick={handleJoinMeeting}
                  sx={{ color: "#1a73e8", fontWeight: 600 }}
                >
                  Join
                </Button>
              )}
              
            </Box>
          </Paper>
        </Grid>

        {/* Optional Right-Side Graphic Area */}
        <Grid item xs={12} md={6} lg={5} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
           {/* You can add an illustration or image here later */}
        </Grid>

      </Grid>
    </Box>
  );
}