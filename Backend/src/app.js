import dotenv from "dotenv";

dotenv.config();

import express  from "express";
import {createServer} from "node:http"
// import {Server} from "socket.io";
import {connectToSocket } from "./controllers/socketManger.js";
import mongoose from "mongoose";
import cors from "cors";

import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);


import userRoutes from "./routes/users.routes.js";

app.set("port", (process.env.PORT || 8000));

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL
];
  
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(passport.initialize());

app.use(express.json({limit : "40kb"}));

app.use(express.urlencoded({limit : "40kb", extended : true}));

app.use("/api/v1/users", userRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Page is Working");
});

const connectionDb = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    }
  };

const start = async () => {
    await connectionDb();
    server.listen(app.get("port"), () => {
        console.log(`Server running on port ${app.get("port")}`);
        console.log(process.env.CLIENT_URL);

    });
}

start();