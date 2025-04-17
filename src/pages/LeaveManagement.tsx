
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CalendarPlus, User, Users, CheckCircle } from "lucide-react";

const LeaveManagement = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leave Management</h1>
          <p className="text-muted-foreground">Track and manage employee leave requests</p>
        </div>
        <Button>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Request Leave
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 urgent requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">6.5% of workforce</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Requests</CardTitle>
              <CardDescription>
                Review and manage leave requests from your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">HR Department</p>
                    </div>
                    <div className="text-sm text-attendance-leave font-medium">
                      Annual Leave
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Duration:</span>
                    <span>May 15 - May 20, 2025 (5 days)</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Reason:</span>
                    <span>Family vacation</span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">Deny</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Michael Brown</h3>
                      <p className="text-sm text-muted-foreground">Finance Department</p>
                    </div>
                    <div className="text-sm text-attendance-leave font-medium">
                      Sick Leave
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Duration:</span>
                    <span>April 22, 2025 (1 day)</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Reason:</span>
                    <span>Medical appointment</span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">Deny</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Emily Davis</h3>
                      <p className="text-sm text-muted-foreground">Marketing Department</p>
                    </div>
                    <div className="text-sm text-attendance-leave font-medium">
                      Personal Leave
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Duration:</span>
                    <span>May 5, 2025 (1 day)</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Reason:</span>
                    <span>Personal matters</span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">Deny</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>
                View upcoming and past leave schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Calendar view will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle>Department Leave Balances</CardTitle>
              <CardDescription>
                Overview of leave balances by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">IT Department</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Annual Leave Used</span>
                      <span>145/280 days</span>
                    </div>
                    <Progress value={52} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">HR Department</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Annual Leave Used</span>
                      <span>48/105 days</span>
                    </div>
                    <Progress value={46} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Finance Department</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Annual Leave Used</span>
                      <span>72/126 days</span>
                    </div>
                    <Progress value={57} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Marketing Department</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Annual Leave Used</span>
                      <span>65/147 days</span>
                    </div>
                    <Progress value={44} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Sales Department</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Annual Leave Used</span>
                      <span>98/210 days</span>
                    </div>
                    <Progress value={47} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveManagement;
