import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  try {
    // Reuse existing connection in serverless / hot-reload environments
    if (isConnected || mongoose.connection.readyState === 1) {
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // In a serverless environment, avoid process.exit(1) as it crashes the function.
    // Let the error bubble up so the request fails gracefully instead of killing the runtime.
    throw err;
  }
};

export default connectDB;
