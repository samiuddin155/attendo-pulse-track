
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="general">General Settings</TabsTrigger>
        <TabsTrigger value="user-roles">User Roles</TabsTrigger>
        <TabsTrigger value="shifts">Shift Configuration</TabsTrigger>
        <TabsTrigger value="holidays">Holiday Calendar</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure general settings for the attendance system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" value="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Input id="company-address" value="123 Main St, Anytown, CA 12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input id="company-email" type="email" value="info@acmecorp.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone</Label>
                  <Input id="company-phone" type="tel" value="(555) 123-4567" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Working Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work-start">Work Day Start</Label>
                  <Input id="work-start" type="time" value="09:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work-end">Work Day End</Label>
                  <Input id="work-end" type="time" value="17:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work-days">Working Days</Label>
                  <Select defaultValue="mon-fri">
                    <SelectTrigger id="work-days">
                      <SelectValue placeholder="Select work days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mon-fri">Monday to Friday</SelectItem>
                      <SelectItem value="mon-sat">Monday to Saturday</SelectItem>
                      <SelectItem value="all">All Days</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grace-period">Grace Period (minutes)</Label>
                  <Input id="grace-period" type="number" value="15" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-late" className="cursor-pointer">Email notifications for late arrival</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to managers when employees are late</p>
                  </div>
                  <Switch id="notify-late" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-absent" className="cursor-pointer">Email notifications for absence</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to managers when employees are absent</p>
                  </div>
                  <Switch id="notify-absent" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-report" className="cursor-pointer">Daily attendance report</Label>
                    <p className="text-sm text-muted-foreground">Send daily attendance reports to department heads</p>
                  </div>
                  <Switch id="daily-report" defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="user-roles">
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>
              Manage user roles and access permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Role-based access control</AlertTitle>
              <AlertDescription>
                Changes to user roles will immediately affect user permissions across the system.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Administrator</h3>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground pb-2 border-b">Full system access</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Switch id="admin-attendance" defaultChecked disabled />
                      <Label htmlFor="admin-attendance" className="text-sm">Manage Attendance</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="admin-employees" defaultChecked disabled />
                      <Label htmlFor="admin-employees" className="text-sm">Manage Employees</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="admin-departments" defaultChecked disabled />
                      <Label htmlFor="admin-departments" className="text-sm">Manage Departments</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="admin-shifts" defaultChecked disabled />
                      <Label htmlFor="admin-shifts" className="text-sm">Manage Shifts</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="admin-roles" defaultChecked disabled />
                      <Label htmlFor="admin-roles" className="text-sm">Manage Roles</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="admin-settings" defaultChecked disabled />
                      <Label htmlFor="admin-settings" className="text-sm">System Settings</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Manager</h3>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground pb-2 border-b">Department-specific access</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Switch id="manager-attendance" defaultChecked />
                      <Label htmlFor="manager-attendance" className="text-sm">View Attendance</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="manager-edit-attendance" defaultChecked />
                      <Label htmlFor="manager-edit-attendance" className="text-sm">Edit Attendance</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="manager-employees" defaultChecked />
                      <Label htmlFor="manager-employees" className="text-sm">View Employees</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="manager-approvals" defaultChecked />
                      <Label htmlFor="manager-approvals" className="text-sm">Approve Leaves</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="manager-reports" defaultChecked />
                      <Label htmlFor="manager-reports" className="text-sm">Generate Reports</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="manager-settings" />
                      <Label htmlFor="manager-settings" className="text-sm">System Settings</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Employee</h3>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground pb-2 border-b">Self-service access</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Switch id="employee-own-attendance" defaultChecked />
                      <Label htmlFor="employee-own-attendance" className="text-sm">View Own Attendance</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="employee-leave-request" defaultChecked />
                      <Label htmlFor="employee-leave-request" className="text-sm">Request Leave</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="employee-profile" defaultChecked />
                      <Label htmlFor="employee-profile" className="text-sm">View Profile</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="employee-team" />
                      <Label htmlFor="employee-team" className="text-sm">View Team</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="employee-dashboard" defaultChecked />
                      <Label htmlFor="employee-dashboard" className="text-sm">Dashboard Access</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="shifts">
        <Card>
          <CardHeader>
            <CardTitle>Shift Configuration</CardTitle>
            <CardDescription>
              Define and manage work shifts for different departments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Morning Shift</h3>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Timing</div>
                    <div>8:00 AM - 4:00 PM</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Break</div>
                    <div>12:00 PM - 1:00 PM (60 min)</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Departments</div>
                    <div>HR, Finance, Admin</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Afternoon Shift</h3>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Timing</div>
                    <div>2:00 PM - 10:00 PM</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Break</div>
                    <div>6:00 PM - 6:30 PM (30 min)</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Departments</div>
                    <div>Customer Support, Operations</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Night Shift</h3>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Timing</div>
                    <div>10:00 PM - 6:00 AM</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Break</div>
                    <div>2:00 AM - 2:30 AM (30 min)</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Departments</div>
                    <div>IT, Security</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Flexible Shift</h3>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Timing</div>
                    <div>Any 8 hours between 7:00 AM - 7:00 PM</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Break</div>
                    <div>60 minutes (flexible)</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Departments</div>
                    <div>IT Development, Design, Marketing</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline">
                Add New Shift
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="holidays">
        <Card>
          <CardHeader>
            <CardTitle>Holiday Calendar</CardTitle>
            <CardDescription>
              Manage holidays and non-working days for the year.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upcoming Holidays</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Memorial Day</div>
                      <div className="text-sm text-muted-foreground">May 27, 2025</div>
                    </div>
                    <div>
                      <Badge className="bg-primary">National Holiday</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Independence Day</div>
                      <div className="text-sm text-muted-foreground">July 4, 2025</div>
                    </div>
                    <div>
                      <Badge className="bg-primary">National Holiday</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Company Foundation Day</div>
                      <div className="text-sm text-muted-foreground">August 15, 2025</div>
                    </div>
                    <div>
                      <Badge variant="outline">Company Holiday</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Labor Day</div>
                      <div className="text-sm text-muted-foreground">September 1, 2025</div>
                    </div>
                    <div>
                      <Badge className="bg-primary">National Holiday</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Thanksgiving Day</div>
                      <div className="text-sm text-muted-foreground">November 27, 2025</div>
                    </div>
                    <div>
                      <Badge className="bg-primary">National Holiday</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end">
                  <Button variant="outline">
                    Add Holiday
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Optional Holidays</h3>
                <p className="text-sm text-muted-foreground">
                  Employees can choose up to 2 optional holidays from this list.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Martin Luther King Jr. Day</div>
                      <div className="text-sm text-muted-foreground">January 20, 2025</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Presidents' Day</div>
                      <div className="text-sm text-muted-foreground">February 17, 2025</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Good Friday</div>
                      <div className="text-sm text-muted-foreground">April 18, 2025</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Columbus Day</div>
                      <div className="text-sm text-muted-foreground">October 13, 2025</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Veterans Day</div>
                      <div className="text-sm text-muted-foreground">November 11, 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
