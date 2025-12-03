import mongoose from "mongoose";

let connectionPromise = null;

// Listen to connection events to track actual connection state
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection lost');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const connectDB = async () => {
  try {
    // Always check actual connection state first (readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
    if (mongoose.connection.readyState === 1) {
      return; // Already connected
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
    connectionPromise = null;
    console.log("MongoDB Connected");
  } catch (err) {
    connectionPromise = null;
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export default connectDB;
