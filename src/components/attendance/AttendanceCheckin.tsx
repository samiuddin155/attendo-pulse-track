
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface AttendanceStatus {
  employeeId: string | null;
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  notes: string | null;
}

export function AttendanceCheckin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [todayAttendance, setTodayAttendance] = useState<AttendanceStatus>({
    employeeId: null,
    date: format(new Date(), "yyyy-MM-dd"),
    status: "absent",
    checkIn: null,
    checkOut: null,
    notes: null
  });
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchEmployeeId();
    }
  }, [user]);

  useEffect(() => {
    if (employeeId) {
      fetchTodayAttendance();
    }
  }, [employeeId]);

  const fetchEmployeeId = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching employee ID:", error);
        return;
      }

      if (data) {
        setEmployeeId(data.id);
        setTodayAttendance(prev => ({ ...prev, employeeId: data.id }));
      }
    } catch (error) {
      console.error("Error in fetchEmployeeId:", error);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", employeeId)
        .eq("date", today)
        .single();

      if (error) {
        if (error.code !== "PGRST116") { // No rows returned is expected if no check-in yet
          console.error("Error fetching today's attendance:", error);
        }
        return;
      }

      if (data) {
        // Convert from DB record to our AttendanceStatus format
        setTodayAttendance({
          employeeId: data.employee_id,
          date: data.date,
          status: data.status,
          checkIn: data.check_in,
          checkOut: data.check_out,
          notes: data.notes
        });
      }
    } catch (error) {
      console.error("Error in fetchTodayAttendance:", error);
    }
  };

  const handleCheckIn = async () => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Could not identify employee record",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const now = new Date().toISOString();
    const today = format(new Date(), "yyyy-MM-dd");

    try {
      const { data, error } = await supabase
        .from("attendance")
        .upsert({
          employee_id: employeeId,
          date: today,
          check_in: now,
          status: "present",
          notes: note || null,
        }, { onConflict: "employee_id, date" })
        .select()
        .single();

      if (error) {
        toast({
          title: "Check-in failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Convert from DB record to our AttendanceStatus format
      setTodayAttendance({
        employeeId: data.employee_id,
        date: data.date,
        status: data.status,
        checkIn: data.check_in,
        checkOut: data.check_out,
        notes: data.notes
      });

      toast({
        title: "Checked in",
        description: `Successfully checked in at ${format(new Date(now), "h:mm a")}`,
      });

      setNote("");
    } catch (error: any) {
      toast({
        title: "Check-in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Could not identify employee record",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const now = new Date().toISOString();
    const today = format(new Date(), "yyyy-MM-dd");

    try {
      const { data, error } = await supabase
        .from("attendance")
        .update({
          check_out: now,
          notes: note ? (todayAttendance.notes ? `${todayAttendance.notes}; ${note}` : note) : todayAttendance.notes,
        })
        .eq("employee_id", employeeId)
        .eq("date", today)
        .select()
        .single();

      if (error) {
        toast({
          title: "Check-out failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Convert from DB record to our AttendanceStatus format
      setTodayAttendance({
        employeeId: data.employee_id,
        date: data.date,
        status: data.status,
        checkIn: data.check_in,
        checkOut: data.check_out,
        notes: data.notes
      });

      toast({
        title: "Checked out",
        description: `Successfully checked out at ${format(new Date(now), "h:mm a")}`,
      });

      setNote("");
    } catch (error: any) {
      toast({
        title: "Check-out failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Daily Attendance</CardTitle>
        <CardDescription>Check in and out for today</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-between space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">Today's Status</div>
          
          <div className="flex items-center justify-center p-4 border rounded-md">
            {todayAttendance.status === "present" ? (
              <div className="flex flex-col items-center text-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-600" />
                <span className="text-lg font-medium">Present</span>
                
                {todayAttendance.checkIn && (
                  <span className="text-sm text-muted-foreground">
                    Check in: {format(new Date(todayAttendance.checkIn), "h:mm a")}
                  </span>
                )}
                
                {todayAttendance.checkOut && (
                  <span className="text-sm text-muted-foreground">
                    Check out: {format(new Date(todayAttendance.checkOut), "h:mm a")}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-2">
                <Clock className="h-12 w-12 text-muted-foreground" />
                <span className="text-lg font-medium">Not Checked In</span>
                <span className="text-sm text-muted-foreground">
                  Please check in to start your workday
                </span>
              </div>
            )}
          </div>
        </div>
        
        {(!todayAttendance.checkOut || !todayAttendance.checkIn) && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Add a note (optional)</div>
            <Textarea 
              placeholder="Working from home, at client site, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {!todayAttendance.checkIn ? (
          <Button 
            className="w-full" 
            onClick={handleCheckIn} 
            disabled={loading}
          >
            <Clock className="mr-2 h-4 w-4" />
            Check In
          </Button>
        ) : !todayAttendance.checkOut ? (
          <Button 
            className="w-full" 
            onClick={handleCheckOut} 
            disabled={loading}
          >
            <Clock className="mr-2 h-4 w-4" />
            Check Out
          </Button>
        ) : (
          <div className="flex items-center justify-center rounded-md p-2 bg-muted w-full">
            <XCircle className="mr-2 h-4 w-4" />
            <span>Already checked out for today</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
