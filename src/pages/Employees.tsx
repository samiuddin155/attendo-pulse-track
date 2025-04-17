
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const Employees = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Employees</h1>
          <p className="text-muted-foreground">Manage employee information and records</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>
      
      <EmployeeTable />
    </div>
  );
};

export default Employees;
