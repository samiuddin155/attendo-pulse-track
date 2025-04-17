
import { Users, Clock, Calendar, UserCheck } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { DepartmentAttendance } from "@/components/dashboard/DepartmentAttendance";
import { AttendanceTrend } from "@/components/dashboard/AttendanceTrend";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your attendance dashboard</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value="248"
          icon={<Users className="h-4 w-4" />}
          description="Active employees in the system"
          trend={{ value: 4, isPositive: true }}
        />
        <StatsCard
          title="Present Today"
          value="207"
          icon={<UserCheck className="h-4 w-4" />}
          description="83.5% of total workforce"
          trend={{ value: 2, isPositive: true }}
        />
        <StatsCard
          title="On Leave"
          value="16"
          icon={<Calendar className="h-4 w-4" />}
          description="6.5% of total workforce"
          trend={{ value: 1, isPositive: false }}
        />
        <StatsCard
          title="Late Arrivals"
          value="12"
          icon={<Clock className="h-4 w-4" />}
          description="4.8% of total workforce"
          trend={{ value: 3, isPositive: false }}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <AttendanceChart />
        <DepartmentAttendance />
      </div>
      
      <AttendanceTrend />
    </div>
  );
};

export default Dashboard;
