import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export function ActivityStreak() {
  const { token } = useAuth();
  const [streakData, setStreakData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/dashboard/activity`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setStreakData(response.data.weeklyActivity || []);
      } catch (err) {
        console.error("Failed to fetch activity data:", err);
        setStreakData([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchActivityData();
      const interval = setInterval(fetchActivityData, 3000);
      return () => clearInterval(interval);
    }
  }, [token]);
  const getStreakColor = (value: number) => {
    switch (value) {
      case 0:
        return "bg-streak-empty";
      case 1:
        return "bg-streak-light";
      case 2:
        return "bg-streak-medium";
      case 3:
        return "bg-streak-dark";
      default:
        return "bg-streak-empty";
    }
  };

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Activity Streak</h3>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Loading activity data...
        </div>
      ) : (
        <>
          {/* Months */}
          <div className="flex text-xs text-muted-foreground mb-2 pl-0">
            {months.map((month, i) => (
              <span key={i} className="flex-1 text-center">
                {month}
              </span>
            ))}
          </div>

          {/* Streak Grid */}
          <div className="flex gap-[3px] overflow-x-auto pb-2">
            {streakData && streakData.length > 0 ? (
              streakData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={cn(
                        "w-[10px] h-[10px] rounded-sm transition-colors",
                        getStreakColor(day)
                      )}
                      title={`Activity level: ${day}`}
                    />
                  ))}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full text-muted-foreground text-sm">
                No activity data yet. Complete some tasks to see your activity!
              </div>
            )}
          </div>
        </>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-[10px] h-[10px] rounded-sm bg-streak-empty" />
          <div className="w-[10px] h-[10px] rounded-sm bg-streak-light" />
          <div className="w-[10px] h-[10px] rounded-sm bg-streak-medium" />
          <div className="w-[10px] h-[10px] rounded-sm bg-streak-dark" />
        </div>
        <span>More</span>
      </div>
    </Card>
  );
}
