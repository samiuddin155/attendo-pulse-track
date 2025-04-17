
import { SettingsTabs } from "@/components/settings/SettingsTabs";

const Settings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your attendance management system</p>
      </div>
      
      <SettingsTabs />
    </div>
  );
};

export default Settings;
