const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate auth URL
const getAuthUrl = () => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

// Set credentials after login
const setCredentials = (tokens) => {
  oAuth2Client.setCredentials(tokens);
};

// Create a calendar event
const createEvent = async (event) => {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const res = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });
  return res.data;
};

module.exports = { oAuth2Client, getAuthUrl, setCredentials, createEvent };
