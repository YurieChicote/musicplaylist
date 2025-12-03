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

// Initialize DB connection (non-blocking - won't prevent app from starting)
// Connection will be established on first request that needs it
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB on startup:", err.message);
  // Don't throw - let the app start and handle DB errors per-request
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/songs", songRoutes);

// Swagger
swaggerDocs(app);

// Error Handler (after all routes)
app.use(errorHandler);

export default app;

