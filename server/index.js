import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./lib/database.js";
import { mockDB } from "./lib/mockData.js";
import { authMiddleware } from "./lib/auth.js";
import { register, login } from "./routes/auth.js";
import { getPosts, createPost, getUserPosts } from "./routes/posts.js";
import { getUser, getUsers } from "./routes/users.js";
import { handleDemo } from "./routes/demo.js";

export function createServer() {
  const app = express();

  // Initialize database connection with proper fallback
  const initDatabase = async () => {
    try {
      const mongoConnected = await connectToDatabase();
      if (!mongoConnected) {
        console.log('Initializing mock database for demo...');
        await mockDB.init();
        console.log('Mock database initialized with demo data');
      }
    } catch (error) {
      console.log('Database initialization failed, using mock database');
      await mockDB.init();
      console.log('Mock database initialized with demo data');
    }
  };

  // Initialize database asynchronously
  initDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Public routes
  app.get("/api/ping", (req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);

  // Protected routes
  app.use("/api/posts", authMiddleware);
  app.use("/api/users", authMiddleware);

  // Posts routes
  app.get("/api/posts", getPosts);
  app.post("/api/posts", createPost);

  // Users routes
  app.get("/api/users", getUsers);
  app.get("/api/users/:userId", getUser);
  app.get("/api/users/:userId/posts", getUserPosts);

  return app;
}
