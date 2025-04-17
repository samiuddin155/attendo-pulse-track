
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Employee } from "./EmployeeTable";
import { Mail, Phone, Building, Calendar, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EmployeeProfileProps {
  employee: Employee;
}

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Employee Details</TabsTrigger>
        <TabsTrigger value="attendance">Attendance History</TabsTrigger>
        <TabsTrigger value="leaves">Leave Balance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  {employee.avatar ? (
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{employee.name}</h2>
                  <p className="text-muted-foreground">{employee.position}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined on {new Date(employee.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="attendance">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Monthly Attendance Rate</h3>
                <span className="text-sm text-muted-foreground">Apr 2025</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Present Days</span>
                  <span>18/22 days</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Recent Attendance</h3>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  const status = i === 1 ? "absent" : i === 3 ? "on-leave" : "active";
                  
                  return (
                    <div key={i} className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                          <div className="text-xs text-muted-foreground">
                            {status === "active" ? "Check in: 9:00 AM - Check out: 5:30 PM" : status === "on-leave" ? "On Leave" : "Absent"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            status === "active"
                              ? "bg-attendance-present/20 text-attendance-present"
                              : status === "on-leave"
                              ? "bg-attendance-leave/20 text-attendance-leave"
                              : "bg-attendance-absent/20 text-attendance-absent"
                          }`}
                        >
                          {status === "active" ? "Present" : status === "on-leave" ? "On Leave" : "Absent"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="leaves">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Annual Leave</h3>
                <div className="text-2xl font-bold">14 <span className="text-sm font-normal text-muted-foreground">/ 21 days</span></div>
                <Progress value={66} className="h-2 mt-2" />
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Sick Leave</h3>
                <div className="text-2xl font-bold">8 <span className="text-sm font-normal text-muted-foreground">/ 10 days</span></div>
                <Progress value={80} className="h-2 mt-2" />
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Personal Leave</h3>
                <div className="text-2xl font-bold">3 <span className="text-sm font-normal text-muted-foreground">/ 5 days</span></div>
                <Progress value={60} className="h-2 mt-2" />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Recent Leave Requests</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">Annual Leave</div>
                    <div className="text-sm text-muted-foreground">Apr 10 - Apr 12, 2025</div>
                  </div>
                  <div>
                    <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">Sick Leave</div>
                    <div className="text-sm text-muted-foreground">Mar 23, 2025</div>
                  </div>
                  <div>
                    <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">Personal Leave</div>
                    <div className="text-sm text-muted-foreground">May 5, 2025</div>
                  </div>
                  <div>
                    <div className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
