import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBgClass?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon, iconBgClass, trend }: StatsCardProps) {
  return (
    <Card className="p-5 bg-card border-border">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-warning"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.value} this week</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          iconBgClass || "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
