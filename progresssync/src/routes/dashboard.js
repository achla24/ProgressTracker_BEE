const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    todayTasks: 3,
    completedTasks: 1,
    focusMinutes: 50,
    googleCalendarConnected: false,
  });
});

module.exports = router;
