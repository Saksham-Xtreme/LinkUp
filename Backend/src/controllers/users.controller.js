import { User } from "../models/users.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Meeting } from "../models/meeting.model.js";
// Email validation helper (Regex)
const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        } 

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }
 
        const token = jwt.sign(
            { id: user._id, username: user.username, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        ); 

        return res.status(httpStatus.OK).json({
            token,
            user: { id: user._id, username: user.username, name: user.name }
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const register = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        // 1. Check for missing fields
        if (!name || !username || !email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "All fields are required" });
        }

        // 2. Email Format Validation
        if (!isEmailValid(email)) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide a valid email address" });
        }

        // 3. Username Length Check
        if (username.length < 3) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Username must be at least 3 characters long" });
        }

        // 4. Password Strength Check
        if (password.length < 8) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Password must be at least 8 characters long" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: "User with this username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });
  
        await newUser.save();
        return res.status(httpStatus.CREATED).json({ message: "User registered successfully" });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const getHistory = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Token is required" });
    }

    try {
        // 1. Decode the JWT to extract the user's ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Search Meeting collection using the User's ID, sorted by most recent first
        const meetings = await Meeting.find({ user_id: decoded.id }).sort({ date: -1 });

        // 3. Return the history array
        return res.status(httpStatus.OK).json(meetings);

    } catch (error) {
        console.error("History fetch error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve meeting history" });
    }
};

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    // 1. Validate incoming data
    if (!token || !meeting_code) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Token and meeting code are required" });
    }

    try {
        // 2. Decode the JWT to securely get the user's ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Create the new meeting record matching your Meeting schema
        const newMeeting = new Meeting({
            user_id: decoded.id,
            meeting_code: meeting_code
        });

        // 4. Save to MongoDB
        await newMeeting.save();

        return res.status(httpStatus.CREATED).json({ message: "Meeting successfully added to history" });

    } catch (error) {
        console.error("Add to history error:", error);
        
        // Handle specific JWT errors so the frontend knows if the user needs to log in again
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid or expired token" });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to add meeting to history" });
    }
};

// Don't forget to export it alongside your other controllers!
export { login, register, getHistory, addToHistory };