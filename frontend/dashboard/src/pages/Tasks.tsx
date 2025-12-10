import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskList } from "@/components/dashboard/TaskList";

const Tasks = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground">Manage all your tasks in one place.</p>
      </div>
      <TaskList />
    </DashboardLayout>
  );
};

export default Tasks;
