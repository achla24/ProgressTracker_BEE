import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">View and plan your schedule.</p>
      </div>
      <Card className="p-6 bg-card border-border inline-block">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="pointer-events-auto"
        />
      </Card>
    </DashboardLayout>
  );
};

export default CalendarPage;
