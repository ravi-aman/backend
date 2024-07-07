import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Configure CORS middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin
    credentials: true, // Include credentials in requests
}));

// Middleware to parse JSON requests with a size limit
app.use(express.json({ limit: "16kb" }));

// Middleware to parse URL-encoded requests with a size limit
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse cookies
app.use(cookieParser());

// Router import
import userRouter from "./routes/user.routes.js";

// Route declaration
app.use("/api/v1/user", userRouter); // Use userRouter for routes starting with "/api/v1/user"

// Export the app instance for use in other modules
export { app };

// Example route: http://localhost:8000/api/v1/user/register
