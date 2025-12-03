export default (err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  
  // Don't send error details in production, but log them
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";
  
  res.status(statusCode).json({ 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
