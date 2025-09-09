const express = require("express");
const router = express.Router();
const { oAuth2Client, getAuthUrl, setCredentials, createEvent } = require("../services/google");

// Step 1: Redirect user to Google login
router.get("/auth", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// Step 2: Google redirects back with code
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  setCredentials(tokens);
  res.json({ message: "Google Calendar connected ✅", tokens });
});

// Step 3: Create a new event
router.post("/event", async (req, res) => {
  try {
    const event = {
      summary: req.body.title,
      description: req.body.description,
      start: { dateTime: req.body.start, timeZone: "Asia/Kolkata" },
      end: { dateTime: req.body.end, timeZone: "Asia/Kolkata" },
    };

    const newEvent = await createEvent(event);
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
