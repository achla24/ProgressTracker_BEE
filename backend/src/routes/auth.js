// const fs = require("fs").promises;
// const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/User")

// const USERS_FILE = path.join(__dirname, "../../data/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Helper: load users
// async function loadUsers() {
//   try {
//     const data = await fs.readFile(USERS_FILE, "utf-8");
//     return JSON.parse(data);
//   } catch {
//     return [];
//   }
// }

// Helper: save users
// async function saveUsers(users) {
//   await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
// }

// Register
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = await User.create({
      email,
      name,
      password: hashed,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});
// router.post("/register", async (req, res) => {
//   const { email, password, name } = req.body;
//   if (!email || !password || !name) {
//     return res.status(400).json({ error: "All fields required" });
//   }

//   const users = await loadUsers();   
//   if (users.find(u => u.email === email)) {
//     return res.status(400).json({ error: "Email already registered" });
//   }

//   const hashed = await bcrypt.hash(password, 10);
//   const newUser = { id: Date.now().toString(), email, name, password: hashed };
//   users.push(newUser);
//   await saveUsers(users);

//   res.status(201).json({ message: "User registered successfully" });
// });


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const users = await loadUsers();
//   const user = users.find(u => u.email === email);

//   if (!user) {
//     return res.status(400).json({ error: "Invalid credentials" });
//   }

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) {
//     return res.status(400).json({ error: "Invalid credentials" });
//   }

//   // create JWT
//   const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
//     expiresIn: "1h",
//   });

//   res.json({ token });
// });

module.exports = router;