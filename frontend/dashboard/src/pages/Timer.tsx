import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PomodoroTimer } from "@/components/dashboard/PomodoroTimer";

const Timer = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Timer</h1>
        <p className="text-muted-foreground">Stay focused with the Pomodoro technique.</p>
      </div>
      <div className="max-w-md">
        <PomodoroTimer />
      </div>
    </DashboardLayout>
  );
};

export default Timer;
