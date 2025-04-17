
import { useState } from "react";
import { LeaveManagementTable } from "@/components/leave/LeaveManagementTable";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const LeaveManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leave Management</h1>
          <p className="text-muted-foreground">Request and manage time off</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Request Leave
        </Button>
      </div>
      
      <LeaveManagementTable />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
          </DialogHeader>
          <LeaveRequestForm 
            onSuccess={() => setIsFormOpen(false)} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;
