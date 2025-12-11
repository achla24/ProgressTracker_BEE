const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Task = require("../models/Task")

const router = express.Router();
// const TASKS_DIR = path.join(__dirname, "../../data/tasks");

//---------FUNC FOR JSON FILES-------//

// async function loadTasks(userId) {
//   try {
//     const filePath = path.join(TASKS_DIR, `${userId}.json`);
//     const data = await fs.readFile(filePath, "utf-8");
//     return JSON.parse(data);
//   } catch {
//     return []; 
//   }
// }
// async function saveTasks(userId, tasks) {
//   const filePath = path.join(TASKS_DIR, `${userId}.json`);
//   await fs.mkdir(TASKS_DIR, { recursive: true });
//   await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
// }



//-------------FETCHING TASKS FOR A USER-------------------//

//for JSON file:-
// router.get("/", authMiddleware, async (req, res) => {
//   const tasks = await loadTasks(req.user.id);
//   res.json(tasks);
// });

//for MongoDB:-
router.get("/",authMiddleware,async(req,res)=>{
  const {from, to} = req.query

  try{
    const filter = {userId : req.user.id}
    if(from && to){
      filter.dueDate = {
        $gte : new Date(from),
        $lte : new Date(to)
      }
    }
    // Use Mongoose sorting instead of Array.toSorted
    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  }catch(err){
    console.log(err);
    res.status(500).json({error: "issue fetching tasks"})
  }
})



//-------------POSTING TASKS FOR A USER-------------------//

//for JSON file:-
// router.post("/", authMiddleware, async (req, res) => {
//   const { title } = req.body;
//   if (!title) return res.status(400).json({ error: "Title is required" });

//   const tasks = await loadTasks(req.user.id);
//   const newTask = { id: Date.now().toString(), title, completed: false };
//   tasks.push(newTask);
//   await saveTasks(req.user.id, tasks);

//   res.status(201).json(newTask);
// });

//for MongoDB:-
router.post("/",authMiddleware,async (req,res)=>{
  const {title,dueDate} = req.body
  if(!title) return res.status(400).json({error: "title is required"})

  try{
    const newTask = await Task.create({
      userId: req.user.id,
      title,
      completed:false,
      dueDate: dueDate ? new Date(dueDate) : null
    })
    res.status(201).json(newTask)
  }catch(err){
    console.error("Create task error:", err);  // <-- Add this
  res.status(500).json({ error: "server error" });

  }
})




//------------PATCH A TASK---------------//

//for MongoDB
router.patch("/:id",authMiddleware,async(req,res)=>{
  const {id} = req.params
  const {title,completed,dueDate} = req.body   //new title and completed in json body

  try{
    const updated = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $set: {
          title,
          completed,
          dueDate: dueDate ? new Date(dueDate) : undefined
        }
      },
      { new: true }
    );
    if(!updated) res.status(500).json({error :"task not found/updated"})
    res.json(updated)
  }catch(err){
    console.error(err)
    res.status(500).json({error:"server error"})
  }
})

//for JSON file:-
// router.patch("/:id", authMiddleware, async (req, res) => {
//   const { id } = req.params;
//   const { title, completed } = req.body;

//   const tasks = await loadTasks(req.user.id);
//   const task = tasks.find(t => t.id === id);
//   if (!task) return res.status(404).json({ error: "Task not found" });

//   if (title !== undefined) task.title = title;
//   if (completed !== undefined) task.completed = completed;

//   await saveTasks(req.user.id, tasks);
//   res.json(task);
// });




//-----------DELETE A TASK---------------//

//MongoDB:-
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Task.deleteOne({ _id: id, userId: req.user.id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//JSON file:-
// router.delete("/:id", authMiddleware, async (req, res) => {
//   const { id } = req.params;

//   let tasks = await loadTasks(req.user.id);
//   const initialLength = tasks.length;
//   tasks = tasks.filter(t => t.id !== id);

//   if (tasks.length === initialLength) {
//     return res.status(404).json({ error: "Task not found" });
//   }

//   await saveTasks(req.user.id, tasks);
//   res.json({ message: "Task deleted" });
// });

module.exports = router;