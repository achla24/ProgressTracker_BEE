// Todoist Sync with MongoDB

const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middlewares/auth");
const TodoistTask = require("../models/TodoistTask");

const router = express.Router();

const TODOIST_BASE = "https://api.todoist.com/rest/v2";

const todoistClient = axios.create({
  baseURL: TODOIST_BASE,
  headers: {
    Authorization: `Bearer ${process.env.TODOIST_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/**
 * GET /todoist/sync
 * Sync Todoist tasks to local database (called from UI)
 */
router.get("/sync", authMiddleware, async (req, res) => {
  try {
    const response = await todoistClient.get("/tasks");

    // Remove old tasks for this user before syncing new ones
    await TodoistTask.deleteMany({ userId: req.user.id });

    const todoistTasks = response.data.map((t) => ({
      userId: req.user.id,
      todoistId: t.id,
      content: t.content,
      isCompleted: t.is_completed || false,
      raw: t,
    }));

    await TodoistTask.insertMany(todoistTasks);

    res.json({
      success: true,
      message: `Synced ${todoistTasks.length} tasks from Todoist`,
      taskCount: todoistTasks.length,
      tasks: todoistTasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Failed to sync Todoist tasks",
      details: err.message,
    });
  }
});

/**
 * GET /todoist/tasks
 * Fetch tasks from Todoist API → Store them in MongoDB → Return to user
 */
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const response = await todoistClient.get("/tasks");

    // Remove old tasks for this user before syncing new ones
    await TodoistTask.deleteMany({ userId: req.user.id });

    const todoistTasks = response.data.map((t) => ({
      userId: req.user.id,
      todoistId: t.id,
      content: t.content,
      isCompleted: t.is_completed || false,
      raw: t,
    }));

    await TodoistTask.insertMany(todoistTasks);

    res.json(todoistTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch Todoist tasks",
      details: err.message,
    });
  }
});

/**
 * POST /todoist/tasks
 * Add task to Todoist → Save in MongoDB
 */
router.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Task content is required" });

    const response = await todoistClient.post("/tasks", { content });

    const saved = await TodoistTask.create({
      userId: req.user.id,
      todoistId: response.data.id,
      content: response.data.content,
      isCompleted: false,
      raw: response.data,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create Todoist task",
      details: err.message,
    });
  }
});

/**
 * POST /todoist/tasks/:id/close
 * Close task on Todoist → Update in MongoDB
 */
router.post("/tasks/:id/close", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await todoistClient.post(`/tasks/${id}/close`);

    await TodoistTask.findOneAndUpdate(
      { todoistId: id, userId: req.user.id },
      { isCompleted: true }
    );

    res.json({ message: "Task marked completed in Todoist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to complete Todoist task",
      details: err.message,
    });
  }
});

/**
 * DELETE /todoist/tasks/:id
 * Delete from Todoist → Delete from MongoDB
 */
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await todoistClient.delete(`/tasks/${id}`);

    await TodoistTask.deleteOne({
      todoistId: id,
      userId: req.user.id,
    });

    res.json({ message: "Task deleted from Todoist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete Todoist task",
      details: err.message,
    });
  }
});

module.exports = router;
