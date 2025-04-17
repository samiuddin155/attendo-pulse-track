
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: "Present", value: 65, color: "#10b981" },
  { name: "Absent", value: 10, color: "#ef4444" },
  { name: "Leave", value: 15, color: "#f59e0b" },
  { name: "Late", value: 10, color: "#6366f1" },
];

export function AttendanceChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
