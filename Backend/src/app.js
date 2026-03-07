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

app.use(cors());
app.use(passport.initialize());

app.use(express.json({limit : "40kb"}));

app.use(express.urlencoded({limit : "40kb", extended : true}));

app.use("/api/v1/users", userRoutes);
app.use("/auth", authRoutes);

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
        console.log("Listening on port 8000");

    });
}

start();