import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, TextField, Typography, Box, Grid, Card, CardContent } from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import RestoreIcon from '@mui/icons-material/Restore';
import { useAuth } from "../contexts/AuthContext"; 
import "../styles/home.css"; // Ensure this path matches where your CSS file is saved

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomCode, setRoomCode] = useState("");
  const { getHistoryOfUser } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // 1. Check for token in URL and save it first
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      navigate("/home", { replace: true });
    }

    // 2. Now fetch the history
    const fetchHistory = async () => {
      if (!localStorage.getItem("token")) return;

      try {
        const data = await getHistoryOfUser();
        // Extract the array safely so .map() doesn't crash
        if (Array.isArray(data)) setHistory(data);
        else if (data && Array.isArray(data.history)) setHistory(data.history);
        else if (data && Array.isArray(data.meetingHistory)) setHistory(data.meetingHistory);
        else setHistory([]);
      } catch (error) {
        console.error("Error fetching history:", error);
        setHistory([]);
      }
    };

    fetchHistory();
  }, [location.search, navigate, getHistoryOfUser]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home", { replace: true });
    }
  }, [location, navigate]);

  const handleCreateMeeting = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${newRoomCode}`);
  };

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
    // Replaced inline 'sx' with 'className="homePage"'
    <Box className="homePage">
      
      {/* Navbar */}
      <nav className="homeNav">
        <Box className="navLeft">
          <img src="/Logo.png" className="navLogo" alt="LinkUp Logo" />
          <Typography className="navTitle">LinkUp</Typography>
        </Box>
        <Button variant="outlined" onClick={handleLogout} className="logoutBtn">
          Logout
        </Button>
      </nav>

      {/* Main Content Area */}
      <Box className="contentWrapper">
        <Grid container className="homeContainer">
          
          {/* Left Side - Meeting Controls */}
          <Grid item xs={12} md={6} className="heroSection">
            <Typography className="heroTitle">
                Deeply connected. <br/> No matter the distance.
            </Typography>
            
            <Typography className="heroSubtitle">
                Share a smile, a laugh, and a moment with the ones who matter most. LinkUp is where hearts meet.
            </Typography>

            <Box className="meetingControls">
              <Button
                variant="contained"
                startIcon={<VideoCallIcon />}
                onClick={handleCreateMeeting}
                className="newMeetingBtn"
              >
                Start a Moment
              </Button>

              <Box className="joinInput">
                <KeyboardIcon className="keyboardIcon" />
                <TextField
                  variant="standard"
                  placeholder="Enter a connection code."
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  className="roomInput"
                />
              </Box>

              {roomCode && (
                <Button onClick={handleJoinMeeting} className="joinBtn">
                  Join
                </Button>
              )}
            </Box>
          </Grid>

          {/* Right Side - Meeting History (Needs CSS classes!) */}
          <Grid item xs={12} md={6} className="graphicSection">
            <Box className="historyContainer">
              
              <Typography className="historyHeader">
                <RestoreIcon className="historyIcon" /> Your Recent Connections
              </Typography>

              <Box className="historyList">
                {Array.isArray(history) && history.length > 0 ? (
                  history.map((meeting, index) => (
                    <Card key={index} className="historyCard">
                      <CardContent className="historyCardContent">
                        <Box>
                          <Typography className="historyRoomText">
                            Room: {meeting.meeting_code}
                          </Typography>
                          <Typography className="historyDateText">
                            {new Date(meeting.date).toLocaleDateString()} at {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        <Button 
                          variant="outlined" 
                          onClick={() => navigate(`/room/${meeting.meeting_code}`)}
                          className="rejoinBtn"
                        >
                          Rejoin
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography className="emptyHistoryText">
                    No recent meetings found. Create one to get started!
                  </Typography>
                )}
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}