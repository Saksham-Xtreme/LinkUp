import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import axios from "axios";

export const AuthContext = createContext();

const client = axios.create({
    baseURL: "http://localhost:8000/api/v1/users"
});

export const AuthProvider = ({ children }) => {
    
    const router = useNavigate();
    const [userData, setUserData] = useState(null);

    const handleRegister = async (name, username, email, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                email: email,
                password: password
            });

            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }

        } catch(err) {
            throw err;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username, 
                password: password
            });

            if(request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                // Use React Router for smooth navigation instead of a full page reload
                router("/home"); 
            }

        } catch(err) {
            // Throw the error so Authentication.jsx can catch and display it
            throw err; 
        }
    };

    // Construct the context data object after defining all functions
    const data = {
        userData, 
        setUserData,
        handleRegister,
        handleLogin 
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};