
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmployeeProfile } from "./EmployeeProfile";

export type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: "active" | "on-leave" | "absent";
  joinDate: string;
  avatar?: string;
};

// Sample data
const employees: Employee[] = [
  {
    id: "EMP001",
    name: "John Smith",
    position: "Senior Developer",
    department: "IT",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    status: "active",
    joinDate: "2020-05-12",
  },
  {
    id: "EMP002",
    name: "Sarah Johnson",
    position: "HR Manager",
    department: "HR",
    email: "sarah.johnson@example.com",
    phone: "(555) 234-5678",
    status: "on-leave",
    joinDate: "2019-03-15",
  },
  {
    id: "EMP003",
    name: "Michael Brown",
    position: "Finance Analyst",
    department: "Finance",
    email: "michael.brown@example.com",
    phone: "(555) 345-6789",
    status: "active",
    joinDate: "2021-01-10",
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "emily.davis@example.com",
    phone: "(555) 456-7890",
    status: "absent",
    joinDate: "2018-11-20",
  },
  {
    id: "EMP005",
    name: "David Wilson",
    position: "Sales Manager",
    department: "Sales",
    email: "david.wilson@example.com",
    phone: "(555) 567-8901",
    status: "active",
    joinDate: "2017-08-05",
  },
];

export function EmployeeTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "bg-attendance-present";
      case "on-leave":
        return "bg-attendance-leave";
      case "absent":
        return "bg-attendance-absent";
      default:
        return "bg-muted";
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(employee.status)} text-white`}
                  >
                    {employee.status === "active"
                      ? "Present"
                      : employee.status === "on-leave"
                      ? "On Leave"
                      : "Absent"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={selectedEmployee !== null}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
          </DialogHeader>
          {selectedEmployee && <EmployeeProfile employee={selectedEmployee} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
