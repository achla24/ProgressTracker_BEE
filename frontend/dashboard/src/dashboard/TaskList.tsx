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
  dueDate?: string;
  createdAt?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export function TaskList() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todoistTasks, setTodoistTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingTodoist, setIsAddingTodoist] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTodoistTaskTitle, setNewTodoistTaskTitle] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isLoadingTodoist, setIsLoadingTodoist] = useState(false);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      setIsLoadingTasks(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          from: today.toISOString(),
          to: tomorrow.toISOString()
        }
      });
      setTasks(response.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const fetchTodoistTasks = async () => {
    if (!token) return;
    try {
      setIsLoadingTodoist(true);
      const response = await axios.get(`${API_BASE_URL}/todoist/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedTasks = response.data.map((t: any) => ({
        _id: t._id,
        id: t.todoistId,
        title: t.content,
        completed: t.isCompleted,
      }));
      setTodoistTasks(mappedTasks);
    } catch (err) {
      console.error("Failed to fetch todoist tasks:", err);
      alert("Failed to fetch Todoist tasks");
    } finally {
      setIsLoadingTodoist(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !token) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/tasks`,
        { 
          title: newTaskTitle.trim(),
          dueDate: newTaskDate ? new Date(newTaskDate) : new Date()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Only add to list if due date is today
      const taskDate = new Date(response.data.dueDate);
      const today = new Date();
      if (taskDate.toDateString() === today.toDateString()) {
        setTasks([...tasks, response.data]);
      }
      
      setNewTaskTitle("");
      setNewTaskDate("");
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("Failed to add task. Please try again.");
    }
  };

  const addTodoistTask = async () => {
    if (!newTodoistTaskTitle.trim() || !token) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/todoist/tasks`,
        { content: newTodoistTaskTitle.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newTask = {
        _id: response.data._id,
        id: response.data.todoistId,
        title: response.data.content,
        completed: response.data.isCompleted,
      };
      
      setTodoistTasks([...todoistTasks, newTask]);
      setNewTodoistTaskTitle("");
      setIsAddingTodoist(false);
    } catch (err: any) {
      console.error("Failed to add todoist task:", err);
      const errorMsg = err.response?.data?.details || err.message || "Failed to add task to Todoist";
      alert(`Error: ${JSON.stringify(errorMsg)}`);
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

  const handleTodoistKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodoistTask();
    } else if (e.key === "Escape") {
      setIsAddingTodoist(false);
      setNewTodoistTaskTitle("");
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
          _id: t._id,
          id: t.todoistId,
          title: t.content,
          completed: t.isCompleted,
        }));
        setTodoistTasks(syncedTasks);
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
    <div className="h-full flex flex-col gap-4">
      <Card className="p-5 bg-card border-border flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsAdding(true)}
              className="w-8 h-8 p-0"
              title="Add Task"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isAdding && (
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Input
                autoFocus
                placeholder="Enter task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="w-[140px] cursor-pointer"
                title="Select Due Date"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={addTask}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewTaskTitle("");
                  setNewTaskDate("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2 mt-4 overflow-y-auto max-h-[300px]">
          {isLoadingTasks ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              No tasks for today.
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
                    "flex-1 text-sm text-foreground flex items-center justify-between",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  <span>{task.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                    {task.dueDate 
                      ? new Date(task.dueDate).toLocaleDateString() 
                      : "No date"}
                  </span>
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="p-5 bg-card border-border flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Todoist Tasks</h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsAddingTodoist(true)}
              className="w-8 h-8 p-0"
              title="Add Todoist Task"
            >
              <Plus className="w-4 h-4" />
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

        {isAddingTodoist && (
          <div className="flex items-center gap-2 mb-4">
            <Input
              autoFocus
              placeholder="Enter Todoist task..."
              value={newTodoistTaskTitle}
              onChange={(e) => setNewTodoistTaskTitle(e.target.value)}
              onKeyDown={handleTodoistKeyDown}
              className="flex-1"
            />
            <Button size="sm" onClick={addTodoistTask}>
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAddingTodoist(false);
                setNewTodoistTaskTitle("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="space-y-2 mt-4 overflow-y-auto max-h-[300px]">
          {isLoadingTodoist ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : todoistTasks.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              No Todoist tasks synced.
            </div>
          ) : (
            todoistTasks.map((task) => (
              <div
                key={task._id || task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border border-border bg-background transition-all",
                  task.completed && "opacity-60"
                )}
              >
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
    </div>
  );
}
