require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./src/models/Task');

async function test() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");

    const testTask = {
      userId: "test_user_123",
      title: "Test Task from Script",
      dueDate: new Date()
    };

    console.log("Creating task...", testTask);
    const created = await Task.create(testTask);
    console.log("Task created:", created);

    console.log("Deleting task...");
    await Task.findByIdAndDelete(created._id);
    console.log("Task deleted.");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
