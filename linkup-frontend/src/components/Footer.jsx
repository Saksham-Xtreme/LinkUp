import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language'; // Icon for your portfolio

export default function Footer() {
    return (
        <Box 
            sx={{ 
                textAlign: 'center', 
                py: 3, 
                mt: 'auto', 
                backgroundColor: 'transparent', 
                color: 'white',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <Typography variant="body1" sx={{ mb: 1 }}>
                Designed & Built by <strong>Saksham</strong>
            </Typography>
            
            <Box>
                {/* LinkedIn Link */}
                <IconButton 
                    component="a" 
                    href="https://www.linkedin.com/in/saksham-tripathi-7b25b0330/" // <-- PASTE YOUR LINKEDIN HERE
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ color: '#0A66C2', '&:hover': { color: '#ffffff' } }}
                >
                    <LinkedInIcon fontSize="large" />
                </IconButton>

                {/* Portfolio Link */}
                <IconButton 
                    component="a" 
                    href="https://sakshamtripathi.vercel.app/" // <-- PASTE YOUR PORTFOLIO HERE
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ color: '#4CAF50', '&:hover': { color: '#ffffff' } }}
                >
                    <LanguageIcon fontSize="large" />
                </IconButton>
            </Box>
        </Box>
    );
}