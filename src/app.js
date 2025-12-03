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
connectDB();

const app = express();

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
