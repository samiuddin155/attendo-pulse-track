
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const leaveRequestSchema = z.object({
  leaveType: z.string({
    required_error: "Please select a leave type",
  }),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  reason: z.string().min(1, "Please provide a reason for your leave"),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

interface LeaveRequestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function LeaveRequestForm({ onSuccess, onCancel }: LeaveRequestFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
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
  
  const form = useForm<z.infer<typeof leaveRequestSchema>>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leaveType: "annual",
      reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof leaveRequestSchema>) => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Employee ID not found. Please contact your administrator.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([
          {
            employee_id: employeeId,
            leave_type: values.leaveType,
            start_date: format(values.startDate, 'yyyy-MM-dd'),
            end_date: format(values.endDate, 'yyyy-MM-dd'),
            reason: values.reason,
            status: 'pending',
          },
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!employeeId) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">
          You are not registered as an employee. Please contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate");
                        return startDate && date < startDate;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide a reason for your leave request"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
