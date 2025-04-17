
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { EmployeeProfile } from "./EmployeeProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmployeeTableSearch } from "./table/EmployeeTableSearch";
import { EmployeeTablePagination } from "./table/EmployeeTablePagination";
import { getEmployeeColumns } from "./table/EmployeeTableColumns";

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone: string;
  avatar?: string;
  joinDate: string;
}

async function fetchEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data.map((employee: any) => ({
    id: employee.id,
    name: employee.name,
    email: employee.email,
    position: employee.position,
    department: employee.department,
    phone: employee.phone || '',
    avatar: employee.avatar,
    joinDate: employee.join_date,
  }));
}

export function EmployeeTable() {
  const { toast } = useToast();
  const { userRole } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { data: employees = [], refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:employees')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'employees'
      }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const isAdmin = userRole === 'admin';

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsProfileOpen(true);
  };

  const columns = getEmployeeColumns(isAdmin, handleViewProfile);

  const table = useReactTable<Employee>({
    data: employees as Employee[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <EmployeeTableSearch table={table} />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <EmployeeTablePagination table={table} />
      
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
          </DialogHeader>
          {selectedEmployee && <EmployeeProfile employee={selectedEmployee} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
