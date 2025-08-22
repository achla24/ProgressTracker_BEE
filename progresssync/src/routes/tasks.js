const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();
const TASKS_DIR = path.join(__dirname, "../../data/tasks");

// 🔹 Load user tasks from file
async function loadTasks(userId) {
  try {
    const filePath = path.join(TASKS_DIR, `${userId}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return []; // no tasks file yet
  }
}

// 🔹 Save user tasks to file
async function saveTasks(userId, tasks) {
  const filePath = path.join(TASKS_DIR, `${userId}.json`);
  await fs.mkdir(TASKS_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
}

// ✅ GET all tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await loadTasks(req.user.id);
  res.json(tasks);
});

// ✅ POST new task
router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const tasks = await loadTasks(req.user.id);
  const newTask = { id: Date.now().toString(), title, completed: false };
  tasks.push(newTask);
  await saveTasks(req.user.id, tasks);

  res.status(201).json(newTask);
});

// ✅ PATCH update task
router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const tasks = await loadTasks(req.user.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  await saveTasks(req.user.id, tasks);
  res.json(task);
});

// ✅ DELETE task
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  let tasks = await loadTasks(req.user.id);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: "Task not found" });
  }

  await saveTasks(req.user.id, tasks);
  res.json({ message: "Task deleted" });
});

module.exports = router;
