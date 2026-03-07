import React from 'react'
import "../App.css"
export default function LandingPage(){
    return(
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>LinkUp</h2>
                </div>
                <div className='navList'>
                    <p>Join as Guest</p>
                    <p>Register</p>
                    <div className='LoginButton' >
                        <p>Login</p>
                    </div>
                </div>
                 

            </nav>

            <div className="landingMainContainer">

            </div>
        </div>
    )
}