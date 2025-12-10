import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerMode = "focus" | "break";

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = mode === "focus" ? FOCUS_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(newMode === "focus" ? FOCUS_TIME : BREAK_TIME);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(mode === "focus" ? FOCUS_TIME : BREAK_TIME);
    setIsRunning(false);
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Pomodoro Timer</h3>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          size="sm"
          variant={mode === "focus" ? "default" : "outline"}
          onClick={() => handleModeChange("focus")}
        >
          Focus
        </Button>
        <Button
          size="sm"
          variant={mode === "break" ? "default" : "outline"}
          onClick={() => handleModeChange("break")}
        >
          Break
        </Button>
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-foreground">
              {formatTime(timeLeft)}
            </span>
          </div>
          {/* Indicator dot */}
          <div
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              top: `${50 - 45 * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)}%`,
              left: `${50 + 45 * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className="gap-2"
        >
          <Play className={cn("w-4 h-4", isRunning && "hidden")} />
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
