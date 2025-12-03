import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import playlistRoutes from "./routes/playlist.routes.js";
import songRoutes from "./routes/song.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import { swaggerDocs } from "./swagger.js";

dotenv.config();

const app = express();

// Root Route - Adding root endpoint to avoid 404 errors
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to the Music Playlist API",
    endpoints: {
      playlists: "/api/v1/playlists",
      songs: "/api/v1/songs",
      docs: "/api-docs"
    }
  });
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Middleware to ensure DB connection before API routes
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({ 
      message: "Database connection failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/songs", songRoutes);

// Swagger - must be after middleware but before error handler
swaggerDocs(app);

// Error Handler (after all routes)
app.use(errorHandler);

export default app;

