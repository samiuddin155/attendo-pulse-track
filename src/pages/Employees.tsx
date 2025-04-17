
import { useState } from "react";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

const Employees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { userRole } = useAuth();
  
  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Employees</h1>
          <p className="text-muted-foreground">Manage employee information and records</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsFormOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>
      
      <EmployeeTable />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm 
            onSuccess={() => setIsFormOpen(false)} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
