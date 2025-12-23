const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // hashed password
    todoistToken: { type: String }, // User-specific Todoist API token
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
