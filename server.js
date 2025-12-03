import app from "./src/app.js";

// For Vercel's serverless runtime, we simply export the Express app.
// All initialization (including DB connection) is handled inside src/app.js.
export default app;
