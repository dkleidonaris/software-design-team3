import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Database } from "./app/utils/db";
import userRoutes from "./app/routes/user";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "super_secret_key";

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date() });
});

// Handle unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Not Found" });
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
