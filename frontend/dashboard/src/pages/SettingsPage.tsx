import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Customize your ProgressSync experience.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Settings */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Profile</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="Enter your name" defaultValue="User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </Card>

        {/* Timer Settings */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Timer Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Sound Notifications</p>
                <p className="text-sm text-muted-foreground">Play a sound when timer ends</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Auto-start Breaks</p>
                <p className="text-sm text-muted-foreground">Automatically start break after focus session</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily Reminder</p>
                <p className="text-sm text-muted-foreground">Get reminded to check your tasks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Task Completion</p>
                <p className="text-sm text-muted-foreground">Celebrate when you complete tasks</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
