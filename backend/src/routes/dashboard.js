const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const Task = require("../models/Task");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const allTasks = await Task.find({ userId });
    const completedTasks = await Task.countDocuments({ userId, completed: true });
    const totalTasks = allTasks.length;
    const pendingTasks = totalTasks - completedTasks;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTasks = await Task.countDocuments({
      userId,
      createdAt: { $gte: today }
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      todayTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      googleCalendarConnected: false,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

router.get("/activity", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const allTasks = await Task.find({ userId });

    const activityMap = {};
    allTasks.forEach((task) => {
      const date = new Date(task.createdAt);
      const dateStr = date.toISOString().split("T")[0];
      
      if (!activityMap[dateStr]) {
        activityMap[dateStr] = 0;
      }
      
      if (task.completed) {
        activityMap[dateStr]++;
      }
    });

    const activityData = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const count = activityMap[dateStr] || 0;
      let level = 0;
      if (count >= 1) level = 1;
      if (count >= 3) level = 2;
      if (count >= 5) level = 3;
      
      activityData.push({
        date: dateStr,
        count,
        level,
      });
    }

    const weeklyActivity = [];
    for (let week = 0; week < 53; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const index = week * 7 + day;
        if (index < activityData.length) {
          weekData.push(activityData[index].level);
        }
      }
      if (weekData.length > 0) {
        weeklyActivity.push(weekData);
      }
    }

    res.json({
      weeklyActivity,
      activityData,
    });
  } catch (err) {
    console.error("Activity error:", err);
    res.status(500).json({ error: "Failed to fetch activity data" });
  }
});

module.exports = router;
