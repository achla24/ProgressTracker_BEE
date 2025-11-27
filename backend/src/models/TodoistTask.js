const mongoose = require("mongoose");

const TodoistTaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    todoistId: { type: String, required: true },  // actual Todoist task ID
    content: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    raw: { type: Object } // store full Todoist response if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("TodoistTask", TodoistTaskSchema);
