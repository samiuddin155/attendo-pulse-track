
import { AttendanceLog } from "@/components/attendance/AttendanceLog";

const Attendance = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Attendance Log</h1>
        <p className="text-muted-foreground">Track and manage daily attendance records</p>
      </div>
      
      <AttendanceLog />
    </div>
  );
};

export default Attendance;
