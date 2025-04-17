
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type AttendanceStatus = "present" | "absent" | "late" | "leave";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  workDuration: string;
}

// Sample data
const attendanceData: AttendanceRecord[] = Array.from({ length: 20 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  
  const statuses: AttendanceStatus[] = ["present", "absent", "late", "leave"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const departments = ["IT", "HR", "Finance", "Marketing", "Sales"];
  const department = departments[Math.floor(Math.random() * departments.length)];
  
  const names = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
  ];
  const name = names[Math.floor(Math.random() * names.length)];
  
  let checkIn = "";
  let checkOut = "";
  let workDuration = "";
  
  if (status === "present" || status === "late") {
    const lateMinutes = status === "late" ? 30 + Math.floor(Math.random() * 60) : 0;
    const checkInHour = 9;
    const checkInMinute = lateMinutes;
    checkIn = `${checkInHour}:${checkInMinute.toString().padStart(2, "0")} AM`;
    
    const checkOutHour = 5 + Math.floor(Math.random() * 2);
    const checkOutMinute = Math.floor(Math.random() * 60);
    checkOut = `${checkOutHour}:${checkOutMinute.toString().padStart(2, "0")} PM`;
    
    const totalMinutes = (checkOutHour + 12 - checkInHour) * 60 + (checkOutMinute - checkInMinute);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    workDuration = `${hours}h ${minutes}m`;
  }
  
  return {
    id: `ATT${(i + 1).toString().padStart(3, "0")}`,
    employeeId: `EMP${Math.floor(Math.random() * 10).toString().padStart(3, "0")}`,
    employeeName: name,
    department,
    date,
    checkIn,
    checkOut,
    status,
    workDuration,
  };
});

export function AttendanceLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredAttendance = attendanceData.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = date
      ? record.date.toDateString() === date.toDateString()
      : true;
    
    const matchesDepartment =
      selectedDepartment === "all" || record.department === selectedDepartment;
    
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;
    
    return matchesSearch && matchesDate && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <Badge className="bg-attendance-present">Present</Badge>;
      case "absent":
        return <Badge className="bg-attendance-absent">Absent</Badge>;
      case "late":
        return <Badge className="bg-attendance-late">Late</Badge>;
      case "leave":
        return <Badge className="bg-attendance-leave">On Leave</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Department</SelectLabel>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="leave">On Leave</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Working Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.id}</TableCell>
                <TableCell>
                  <div>
                    <div>{record.employeeName}</div>
                    <div className="text-xs text-muted-foreground">{record.employeeId}</div>
                  </div>
                </TableCell>
                <TableCell>{record.department}</TableCell>
                <TableCell>{format(record.date, "MMM dd, yyyy")}</TableCell>
                <TableCell>{record.checkIn || "-"}</TableCell>
                <TableCell>{record.checkOut || "-"}</TableCell>
                <TableCell>{record.workDuration || "-"}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
