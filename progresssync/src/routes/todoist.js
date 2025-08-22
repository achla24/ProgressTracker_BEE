// a bridge between BEE and Todoist with local sync

const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();
const TODOIST_BASE = "https://api.todoist.com/rest/v2";
const DATA_FILE = path.join(__dirname, "../../data/todoistTasks.json");

// 🔹 Axios client with Todoist token
const todoistClient = axios.create({
  baseURL: TODOIST_BASE,
  headers: {
    Authorization: `Bearer ${process.env.TODOIST_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// 🔹 Helper: Save tasks locally
function saveLocalTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ✅ Get all tasks from Todoist (and sync locally)
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const response = await todoistClient.get("/tasks");

    // Save tasks to local JSON
    saveLocalTasks(response.data);

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks", details: err.message });
  }
});

// ✅ Add a new task in Todoist (and update local copy)
router.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Task content is required" });

    const response = await todoistClient.post("/tasks", { content });

    // Append new task locally
    let existing = [];
    if (fs.existsSync(DATA_FILE)) {
      existing = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    existing.push(response.data);
    saveLocalTasks(existing);

    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task", details: err.message });
  }
});

// ✅ Complete (close) a Todoist task (and update local JSON)
router.post("/tasks/:id/close", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await todoistClient.post(`/tasks/${id}/close`);

    // Update local copy: mark task as completed
    if (fs.existsSync(DATA_FILE)) {
      let tasks = JSON.parse(fs.readFileSync(DATA_FILE));
      tasks = tasks.map(t => (t.id == id ? { ...t, is_completed: true } : t));
      saveLocalTasks(tasks);
    }

    res.json({ message: "Task completed in Todoist" });
  } catch (err) {
    res.status(500).json({ error: "Failed to complete task", details: err.message });
  }
});

// ✅ Delete a task from Todoist (and local JSON)
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await todoistClient.delete(`/tasks/${id}`);

    // Update local copy: remove task
    if (fs.existsSync(DATA_FILE)) {
      let tasks = JSON.parse(fs.readFileSync(DATA_FILE));
      tasks = tasks.filter(t => t.id != id);
      saveLocalTasks(tasks);
    }

    res.json({ message: "Task deleted from Todoist" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task", details: err.message });
  }
});

module.exports = router;




// Login → get JWT.

// GET /todoist/tasks → see existing tasks.

// POST /todoist/tasks → add a new one.

// POST /todoist/tasks/:id/close → mark it done.

// DELETE /todoist/tasks/:id → remove it.