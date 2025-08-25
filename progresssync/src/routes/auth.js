const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const USERS_FILE = path.join(__dirname, "../../data/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // use .env in prod

// Helper: load users
async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper: save users
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields required" });
  }

  const users = await loadUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, name, password: hashed };
  users.push(newUser);
  await saveUsers(users);

  res.status(201).json({ message: "User registered successfully" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await loadUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // create JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

module.exports = router;