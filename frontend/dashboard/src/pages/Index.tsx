import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { PomodoroTimer } from "@/components/dashboard/PomodoroTimer";
import { ActivityStreak } from "@/components/dashboard/ActivityStreak";
import { CheckSquare, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface DashboardData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  todayTasks: number;
  completionRate: number;
}

const Index = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    todayTasks: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 3000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Home</h1>
        <p className="text-muted-foreground">Welcome back! Here's your progress overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total Tasks"
          value={loading ? "..." : dashboardData.totalTasks}
          icon={<CheckSquare className="w-5 h-5" />}
          iconBgClass="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Completed"
          value={loading ? "..." : dashboardData.completedTasks}
          icon={<CheckCircle className="w-5 h-5" />}
          iconBgClass="bg-success/10 text-success"
          trend={{ value: `${dashboardData.completionRate}%`, isPositive: dashboardData.completionRate >= 50 }}
        />
        <StatsCard
          title="Pending"
          value={loading ? "..." : dashboardData.pendingTasks}
          icon={<Clock className="w-5 h-5" />}
          iconBgClass="bg-warning/10 text-warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Task List */}
        <TaskList />

        {/* Right Column - Timer & Streak */}
        <div className="flex flex-col gap-6">
          <PomodoroTimer />
          <ActivityStreak />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
