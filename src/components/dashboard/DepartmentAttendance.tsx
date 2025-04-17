
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  {
    name: "IT",
    present: 85,
    absent: 5,
    leave: 10,
  },
  {
    name: "HR",
    present: 90,
    absent: 2,
    leave: 8,
  },
  {
    name: "Finance",
    present: 75,
    absent: 15,
    leave: 10,
  },
  {
    name: "Sales",
    present: 80,
    absent: 10,
    leave: 10,
  },
  {
    name: "Marketing",
    present: 88,
    absent: 5,
    leave: 7,
  },
];

export function DepartmentAttendance() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Department Attendance</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" stackId="a" fill="#10b981" />
            <Bar dataKey="absent" stackId="a" fill="#ef4444" />
            <Bar dataKey="leave" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
