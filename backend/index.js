require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/google", require("./src/routes/google"));

// --- Simple routes for now ---
app.get("/", (req, res) => {
  res.json({ message: "ProgressSync API is running 🚀" });
});

const auth = require("./src/middlewares/auth");
// Placeholder routes (you'll build these later)
app.use("/auth", require("./src/routes/auth"));
app.use("/tasks", auth , require("./src/routes/tasks"));
app.use("/dashboard", require("./src/routes/dashboard"));
app.use("/todoist", require("./src/routes/todoist"));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("🚀 MongoDB connected successfully");
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
    process.exit(1);
  });