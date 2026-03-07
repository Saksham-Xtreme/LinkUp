import { User } from "../models/users.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {

    const { username, password } = req.body;
  
    if (!username || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }
  
    try {
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN
        }
      ); 

    
  
      return res.status(httpStatus.OK).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          
        }
      });
  
    } catch (error) {
  
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong" });
  
    }
};

const register = async (req, res) => {

  const { name, username, email, password } = req.body;

  try {

    if (!name || !username || !email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword
    });
  
    await newUser.save();

    res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" });

  } catch (error) {

    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });

  }

};

export { login , register };