
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type AttendanceStatus = {
  id?: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
};

export function AttendanceCheckin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  
  const today = new Date();
  const formattedDate = format(today, 'yyyy-MM-dd');
  
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
  
  const { data: todayAttendance, refetch } = useQuery({
    queryKey: ['attendance', formattedDate, employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('date', formattedDate)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned"
        console.error(error);
        return null;
      }
      
      return data as AttendanceStatus | null;
    },
    enabled: !!employeeId,
  });
  
  useEffect(() => {
    if (employeeId) {
      // Subscribe to realtime changes
      const channel = supabase
        .channel('public:attendance')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'attendance',
          filter: `employee_id=eq.${employeeId}`
        }, () => {
          refetch();
        })
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [employeeId, refetch]);
  
  const handleCheckIn = async () => {
    if (!employeeId) return;
    
    setLoading(true);
    try {
      const now = new Date();
      const checkInTime = now.toISOString();
      
      if (todayAttendance) {
        // Update existing attendance record
        const { error } = await supabase
          .from('attendance')
          .update({ 
            check_in: checkInTime,
            status: 'present',
          })
          .eq('id', todayAttendance.id);
        
        if (error) throw error;
      } else {
        // Create new attendance record
        const { error } = await supabase
          .from('attendance')
          .insert([
            {
              employee_id: employeeId,
              date: formattedDate,
              check_in: checkInTime,
              status: 'present',
            },
          ]);
        
        if (error) throw error;
      }
      
      toast({
        title: "Check-in successful",
        description: `You checked in at ${format(now, 'h:mm a')}`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckOut = async () => {
    if (!employeeId || !todayAttendance) return;
    
    setLoading(true);
    try {
      const now = new Date();
      const checkOutTime = now.toISOString();
      
      const { error } = await supabase
        .from('attendance')
        .update({ 
          check_out: checkOutTime,
        })
        .eq('id', todayAttendance.id);
      
      if (error) throw error;
      
      toast({
        title: "Check-out successful",
        description: `You checked out at ${format(now, 'h:mm a')}`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!employeeId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Check-in</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You are not registered as an employee. Please contact your administrator.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const currentTime = format(new Date(), 'h:mm a');
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <div className="text-3xl font-bold">{currentTime}</div>
            <div className="text-muted-foreground">{currentDate}</div>
          </div>
          
          <div className="flex items-center justify-center my-6">
            {!todayAttendance ? (
              <div className="text-center text-muted-foreground">
                <XCircle className="h-16 w-16 mx-auto text-muted" />
                <p className="mt-2">You have not checked in today</p>
              </div>
            ) : todayAttendance.checkIn && !todayAttendance.checkOut ? (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                <p className="mt-2">
                  Checked in at{" "}
                  <span className="font-bold">
                    {format(new Date(todayAttendance.checkIn), 'h:mm a')}
                  </span>
                </p>
              </div>
            ) : todayAttendance.checkIn && todayAttendance.checkOut ? (
              <div className="text-center">
                <Clock className="h-16 w-16 mx-auto text-blue-500" />
                <div className="mt-2 space-y-1">
                  <p>
                    Checked in at{" "}
                    <span className="font-bold">
                      {format(new Date(todayAttendance.checkIn), 'h:mm a')}
                    </span>
                  </p>
                  <p>
                    Checked out at{" "}
                    <span className="font-bold">
                      {format(new Date(todayAttendance.checkOut), 'h:mm a')}
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleCheckIn}
              disabled={loading || (!!todayAttendance?.checkIn && !todayAttendance?.checkOut)}
              className="w-32"
            >
              Check In
            </Button>
            <Button 
              onClick={handleCheckOut}
              disabled={loading || !todayAttendance?.checkIn || !!todayAttendance?.checkOut}
              variant="outline"
              className="w-32"
            >
              Check Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
