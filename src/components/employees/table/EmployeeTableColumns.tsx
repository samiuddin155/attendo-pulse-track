
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, MoreHorizontal, Trash, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Employee } from "../EmployeeTable";

interface EmployeeActionsProps {
  employee: Employee;
  isAdmin: boolean;
  onViewProfile: (employee: Employee) => void;
}

const EmployeeActions = ({ employee, isAdmin, onViewProfile }: EmployeeActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => onViewProfile(employee)}>
        View Profile
      </DropdownMenuItem>
      {isAdmin && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export const getEmployeeColumns = (
  isAdmin: boolean,
  onViewProfile: (employee: Employee) => void
): ColumnDef<Employee>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
          {row.original.avatar ? (
            <img
              src={row.original.avatar}
              alt={row.original.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
        <div>{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EmployeeActions 
        employee={row.original} 
        isAdmin={isAdmin} 
        onViewProfile={onViewProfile} 
      />
    ),
  },
];
