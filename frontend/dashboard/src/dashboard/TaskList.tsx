import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface Task {
  _id?: string;
  id?: string;
  title: string;
  completed: boolean;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export function TaskList() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      setIsLoadingTasks(true);
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !token) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/tasks`,
        { title: newTaskTitle.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("Failed to add task. Please try again.");
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task || !token) return;

    try {
      const newCompleted = !task.completed;
      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}`,
        { completed: newCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => (t._id === taskId ? response.data : t)));
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewTaskTitle("");
    }
  };

  const syncTodoist = async () => {
    if (!token) {
      alert("Please log in first");
      return;
    }

    setIsSyncing(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/todoist/sync`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        const syncedTasks = response.data.tasks.map((t: any) => ({
          id: t.todoistId,
          title: t.content,
          completed: t.isCompleted,
        }));
        setTasks(syncedTasks);
        alert(`✓ Synced ${response.data.taskCount} tasks from Todoist!`);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err: any) {
      console.error("Sync error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to sync Todoist tasks";
      alert(errorMsg);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="p-5 bg-card border-border h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={syncTodoist}
            disabled={isSyncing}
          >
            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
            {isSyncing ? "Syncing..." : "Sync API"}
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 mb-4">
          <Input
            autoFocus
            placeholder="Enter task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="sm" onClick={addTask}>
            Add
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsAdding(false);
              setNewTaskTitle("");
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      <div className="space-y-2 mt-4">
        {isLoadingTasks ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No tasks for today. Add a task to get started!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border border-border bg-background transition-all",
                task.completed && "opacity-60"
              )}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => task._id && toggleTask(task._id)}
                className="data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
              <span
                className={cn(
                  "flex-1 text-sm text-foreground",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
