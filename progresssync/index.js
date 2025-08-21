require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- Simple routes for now ---
app.get("/", (req, res) => {
  res.json({ message: "ProgressSync API is running 🚀" });
});

// Placeholder routes (you’ll build these later)
app.use("/auth", require("./src/routes/auth"));
app.use("/tasks", require("./src/routes/tasks"));
app.use("/dashboard", require("./src/routes/dashboard"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
