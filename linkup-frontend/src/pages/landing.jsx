import React from 'react';
import { Link } from 'react-router-dom'; // Added missing import
import "../App.css";

export default function LandingPage() {
    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <img src="/Logo.png" alt="LinkUp Logo" className="navLogo" />
                    <h3 className="Title">LinkUp</h3>
                </div>
                
                <div className='navList'>
                    <button className="Join">Join as Guest</button>
                    <button className="RegisterButton">Register</button>
                    {/* Replaced the div with a proper button element */}
                    <button className='LoginButton'>
                        Login
                    </button>
                </div>
            </nav>

            <div className="landingMainContainer">

                <h1 className="Hero-name">Connect with them</h1>

                <div className="waveBackground"></div>

                <div className="Logo-img">
                    <img src="/Logo.png" alt="Main Logo" />
                </div>

                <Link to="/auth" className="OpenButton">
                    Get Started
                </Link>

                </div>
        </div> 
    );
}