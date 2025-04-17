
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  {
    name: "Mon",
    present: 85,
    absent: 5,
    leave: 10,
  },
  {
    name: "Tue",
    present: 88,
    absent: 4,
    leave: 8,
  },
  {
    name: "Wed",
    present: 82,
    absent: 8,
    leave: 10,
  },
  {
    name: "Thu",
    present: 85,
    absent: 5,
    leave: 10,
  },
  {
    name: "Fri",
    present: 90,
    absent: 3,
    leave: 7,
  },
  {
    name: "Sat",
    present: 80,
    absent: 5,
    leave: 15,
  },
  {
    name: "Sun",
    present: 75,
    absent: 10,
    leave: 15,
  },
];

export function AttendanceTrend() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Attendance Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
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
            <Line
              type="monotone"
              dataKey="present"
              stroke="#10b981"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="absent" stroke="#ef4444" />
            <Line type="monotone" dataKey="leave" stroke="#f59e0b" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
