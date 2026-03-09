import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import axios from "axios";

const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/users`
});

console.log(import.meta.env.VITE_API_URL);
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

    // 1. Fetch History Function
    const getHistoryOfUser = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Pass the token as a query parameter to match req.query.token in your backend
            let request = await client.get("/get_history", {
                params: {
                    token: token
                }
            });

            return request.data; // This will be the array of meetings

        } catch (err) {
            console.error("Failed to fetch history:", err);
            throw err;
        }
    };

    // 2. Add to History Function
    const addToUserHistory = async (meetingCode) => {
        try {
            const token = localStorage.getItem("token");
            
            // Pass token and meeting_code in the body to match req.body in your backend
            let request = await client.post("/add_to_history", {
                token: token,
                meeting_code: meetingCode
            });

            return request.data;

        } catch (err) {
            console.error("Failed to add meeting to history:", err);
            throw err;
        }
    };

    // Construct the context data object after defining all functions
    const data = {
        userData, 
        setUserData,
        handleRegister,
        handleLogin,
        getHistoryOfUser,
        addToUserHistory
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};

// Export the custom hook so other files can use it!
export const useAuth = () => useContext(AuthContext);