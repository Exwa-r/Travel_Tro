const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travel_tro";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 2000,
      family: 4,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Instead of exiting, retry connection after delay
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

// Initial database connection
connectDB();

// Handle database connection errors
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  // Attempt to reconnect
  setTimeout(connectDB, 5000);
});

// Routes
app.use(
  "/api/routes",
  require("./routes/busRoutes")
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
