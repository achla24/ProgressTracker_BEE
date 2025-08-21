const router = require("express").Router();

// Register
router.post("/register", (req, res) => {
  res.json({ message: "User registered (dummy)" });
});

// Login
router.post("/login", (req, res) => {
  res.json({ token: "fake-jwt-token" });
});

module.exports = router;
