
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
import { useAuth } from "@/contexts/AuthContext";

type AttendanceStatus = "present" | "absent" | "late" | "on-leave";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  workDuration: string | null;
}

async function fetchAttendanceRecords() {
  const { data: attendanceData, error: attendanceError } = await supabase
    .from('attendance')
    .select(`
      id,
      employee_id,
      date,
      check_in,
      check_out,
      status,
      employees(name, department)
    `)
    .order('date', { ascending: false });

  if (attendanceError) {
    throw new Error(attendanceError.message);
  }

  const records: AttendanceRecord[] = attendanceData.map((record: any) => {
    let workDuration = null;
    if (record.check_in && record.check_out) {
      const checkInTime = new Date(record.check_in);
      const checkOutTime = new Date(record.check_out);
      const durationMinutes = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      workDuration = `${hours}h ${minutes}m`;
    }

    return {
      id: record.id,
      employeeId: record.employee_id,
      employeeName: record.employees.name,
      department: record.employees.department,
      date: new Date(record.date),
      checkIn: record.check_in,
      checkOut: record.check_out,
      status: record.status as AttendanceStatus,
      workDuration,
    };
  });

  return records;
}

export function AttendanceLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { userRole } = useAuth();

  const { data: attendanceRecords = [], refetch } = useQuery({
    queryKey: ['attendance-records'],
    queryFn: fetchAttendanceRecords,
  });

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:attendance')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'attendance'
      }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const filteredAttendance = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        return <Badge className="bg-green-500">Present</Badge>;
      case "absent":
        return <Badge className="bg-red-500">Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-500">Late</Badge>;
      case "on-leave":
        return <Badge className="bg-blue-500">On Leave</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Only managers and admins can see all records
  const isManagerOrAdmin = userRole === 'admin' || userRole === 'manager';

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
        
        {isManagerOrAdmin && (
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
                  <SelectItem value="on-leave">On Leave</SelectItem>
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
        )}
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
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      <div>{record.employeeName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{format(record.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{record.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "-"}</TableCell>
                  <TableCell>{record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "-"}</TableCell>
                  <TableCell>{record.workDuration || "-"}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
