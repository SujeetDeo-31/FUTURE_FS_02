
"use client";

import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";

const data = [
  { name: "Mon", leads: 12, converted: 2 },
  { name: "Tue", leads: 19, converted: 4 },
  { name: "Wed", leads: 15, converted: 3 },
  { name: "Thu", leads: 22, converted: 8 },
  { name: "Fri", leads: 30, converted: 12 },
  { name: "Sat", leads: 10, converted: 1 },
  { name: "Sun", leads: 5, converted: 0 },
];

const sourcePerformance = [
  { name: "Direct", value: 45 },
  { name: "Organic Search", value: 30 },
  { name: "Social Media", value: 15 },
  { name: "Referrals", value: 10 },
];

const COLORS = ["#7c3aed", "#d8b4fe", "#4f46e5", "#a78bfa"];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Analytics Suite</h1>
          <p className="text-muted-foreground">Deep insights into your sales performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Download className="w-4 h-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Conversion Rate</p>
            <h3 className="text-3xl font-bold font-headline">18.4%</h3>
            <div className="mt-2 text-xs text-green-500 font-medium">+2.1% from last month</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Avg. Response Time</p>
            <h3 className="text-3xl font-bold font-headline">4.2 hrs</h3>
            <div className="mt-2 text-xs text-green-500 font-medium">-1.4 hrs improvement</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Customer Acquisition Cost</p>
            <h3 className="text-3xl font-bold font-headline">$142.00</h3>
            <div className="mt-2 text-xs text-red-400 font-medium">+$12.00 from last month</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="font-headline">Lead vs Converted</CardTitle>
            <CardDescription>Daily lead acquisition compared to conversions</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                />
                <Bar dataKey="leads" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="converted" fill="#d8b4fe" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="font-headline">Source Distribution</CardTitle>
            <CardDescription>Where your highest quality leads are coming from</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcePerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {sourcePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold">1.2k</span>
              <span className="text-xs text-muted-foreground">Total Leads</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
