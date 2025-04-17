
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
  Search,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  duration: number;
}

async function fetchLeaveRequests() {
  const { data: leaveData, error: leaveError } = await supabase
    .from('leave_requests')
    .select(`
      id,
      employee_id,
      leave_type,
      start_date,
      end_date,
      reason,
      status,
      employees(name, department)
    `)
    .order('created_at', { ascending: false });

  if (leaveError) {
    throw new Error(leaveError.message);
  }

  const requests: LeaveRequest[] = leaveData.map((request: any) => {
    const startDate = new Date(request.start_date);
    const endDate = new Date(request.end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days

    return {
      id: request.id,
      employeeId: request.employee_id,
      employeeName: request.employees.name,
      department: request.employees.department,
      leaveType: request.leave_type,
      startDate,
      endDate,
      reason: request.reason,
      status: request.status,
      duration: diffDays,
    };
  });

  return requests;
}

export function LeaveManagementTable() {
  const { toast } = useToast();
  const { userRole, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  // Fetch the current user's employee ID
  useEffect(() => {
    const fetchEmployeeId = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('employees')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setEmployeeId(data.id);
        }
      }
    };
    
    fetchEmployeeId();
  }, [user]);

  const { data: leaveRequests = [], refetch } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: fetchLeaveRequests,
  });

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:leave_requests')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leave_requests'
      }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Filter leave requests based on user role
  const filteredRequests = leaveRequests.filter((request) => {
    // Regular employees can only see their own requests
    if (userRole === 'employee' && request.employeeId !== employeeId) {
      return false;
    }

    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;
    
    const matchesType =
      selectedType === "all" || request.leaveType === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const isManagerOrAdmin = userRole === 'admin' || userRole === 'manager';

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          status: 'approved',
          approved_by: user?.id,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Leave request approved",
        description: "The leave request has been approved successfully.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          status: 'rejected',
          approved_by: user?.id,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Leave request rejected",
        description: "The leave request has been rejected.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center gap-2">
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Leave Type</SelectLabel>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="sick">Sick</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              {isManagerOrAdmin && <TableHead>Department</TableHead>}
              <TableHead>Leave Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              {isManagerOrAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.employeeName}</TableCell>
                  {isManagerOrAdmin && <TableCell>{request.department}</TableCell>}
                  <TableCell className="capitalize">{request.leaveType}</TableCell>
                  <TableCell>{request.duration} day{request.duration > 1 ? 's' : ''}</TableCell>
                  <TableCell>
                    {format(request.startDate, "MMM dd, yyyy")} - {format(request.endDate, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={request.reason}>
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    {request.status === "pending" ? (
                      <Badge className="bg-yellow-500">Pending</Badge>
                    ) : request.status === "approved" ? (
                      <Badge className="bg-green-500">Approved</Badge>
                    ) : (
                      <Badge className="bg-red-500">Rejected</Badge>
                    )}
                  </TableCell>
                  {isManagerOrAdmin && (
                    <TableCell>
                      {request.status === "pending" ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {request.status === "rejected" && (
                              <DropdownMenuItem onClick={() => handleApprove(request.id)}>
                                Approve Instead
                              </DropdownMenuItem>
                            )}
                            {request.status === "approved" && (
                              <DropdownMenuItem onClick={() => handleReject(request.id)}>
                                Reject Instead
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isManagerOrAdmin ? 8 : 6} className="h-24 text-center">
                  No leave requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
