// /backend/src/app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// --- Middleware Configuration ---

// Configure CORS to allow requests from your frontend with credentials
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Use env variable or default
    credentials: true
}));

// Configure middleware for parsing request bodies
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // For static assets
app.use(cookieParser()); // To parse cookies from requests

// --- Routes Import ---
import userRouter from './routes/user.routes.js';
import documentRouter from './routes/documentRoutes.js'; // <-- IMPORT YOUR NEW ROUTER

// --- Routes Declaration ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/documents", documentRouter); // <-- ADD THIS LINE TO USE YOUR NEW ROUTES

// Example of a health check route
// http://localhost:8000/api/v1/healthcheck
app.get("/api/v1/healthcheck", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

export { app };