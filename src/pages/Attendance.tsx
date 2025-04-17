
import { AttendanceLog } from "@/components/attendance/AttendanceLog";
import { AttendanceCheckin } from "@/components/attendance/AttendanceCheckin";

const Attendance = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Attendance Log</h1>
        <p className="text-muted-foreground">Track and manage daily attendance records</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <AttendanceCheckin />
        </div>
        <div className="md:col-span-2">
          <AttendanceLog />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
