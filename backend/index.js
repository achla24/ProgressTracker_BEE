require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* -------------------- MIDDLEWARES -------------------- */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* -------------------- ROUTES -------------------- */
app.use("/google", require("./src/routes/google"));

app.get("/", (req, res) => {
  res.json({ message: "ProgressSync API is running 🚀" });
});

const auth = require("./src/middlewares/auth");

app.use("/auth", require("./src/routes/auth"));
app.use("/tasks", auth, require("./src/routes/tasks"));
app.use("/dashboard", require("./src/routes/dashboard"));
app.use("/todoist", require("./src/routes/todoist"));

/* -------------------- HTTP + SOCKET SERVER -------------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // change later for production
    methods: ["GET", "POST"]
  }
});

/* -------------------- SOCKET LOGIC -------------------- */
require("./src/socket")(io);

/* -------------------- DATABASE + SERVER START -------------------- */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("🚀 MongoDB connected successfully");
    server.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

