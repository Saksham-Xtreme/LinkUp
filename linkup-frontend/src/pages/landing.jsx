import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import "../App.css";

export default function LandingPage() {
    const navigate = useNavigate();
    
    // 1. Check if the user is currently authenticated
    const token = localStorage.getItem("token");

    // 2. Handle the logout process
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Refresh the landing page state
    };

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <img src="/Logo.png" alt="LinkUp Logo" className="navLogo" />
                    <h3 className="Title">LinkUp</h3>
                </div>
                
                <div className='navList'>
                    {/* Conditional Rendering: Switch buttons based on token */}
                    {token ? (
                        <>
                            <button className="Join" onClick={() => navigate("/home")}>
                                My Connections
                            </button>
                            <button className="logoutBtn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                           
                            <button className="RegisterButton" onClick={() => navigate("/auth")}>
                                Register
                            </button>
                            <button className='LoginButton' onClick={() => navigate("/auth")}>
                                Login
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <div className="landingMainContainer">

                <h1 className="Hero-name">Connect with them</h1>

                <div className="waveBackground"></div>

                <div className="Logo-img">
                    <img src="/Logo.png" alt="Main Logo" />
                </div>

                {/* Conditional Rendering: Switch the main call-to-action */}
                {token ? (
                    <Link to="/home" className="OpenButton">
                        Return to Home
                    </Link>
                ) : (
                    <Link to="/auth" className="OpenButton">
                        Get Started
                    </Link>
                )}

            </div>
        </div> 
    );
}