
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Calendar, 
  Settings, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const mainNavItems: SidebarItem[] = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    { title: "Employees", icon: Users, href: "/employees" },
    { title: "Attendance", icon: Clock, href: "/attendance" },
    { title: "Leave Management", icon: Calendar, href: "/leave-management" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-border flex flex-col transition-all duration-300",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center h-16 border-b border-border px-4">
        {open ? (
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-xl text-primary">Attendo</span>
            <button onClick={() => setOpen(false)} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <button onClick={() => setOpen(true)} className="p-1">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-3 rounded-md",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {open && <span className="ml-3">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        {open && (
          <div className="text-xs text-muted-foreground">
            <p>Attendo v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
}
