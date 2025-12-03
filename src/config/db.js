import mongoose from "mongoose";

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  try {
    // Reuse existing connection in serverless / hot-reload environments
    if (isConnected || mongoose.connection.readyState === 1) {
      return;
    }

    // If connection is in progress, wait for it
    if (connectionPromise) {
      return await connectionPromise;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    // Create connection promise
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
    });

    await connectionPromise;
    isConnected = true;
    connectionPromise = null;
    console.log("MongoDB Connected");
  } catch (err) {
    connectionPromise = null;
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export default connectDB;