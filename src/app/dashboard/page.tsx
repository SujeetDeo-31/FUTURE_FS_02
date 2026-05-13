
"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Clock, 
  ArrowUpRight, 
  ChevronRight,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { MOCK_ACTIVITY } from "@/lib/mock-data";

const stats = [
  { label: "Total Leads", value: "1,284", change: "+12.5%", icon: Users, color: "text-blue-500" },
  { label: "Converted", value: "432", change: "+8.2%", icon: Target, color: "text-green-500" },
  { label: "New Leads", value: "48", change: "+18%", icon: Zap, color: "text-purple-500" },
  { label: "Follow-ups Due", value: "12", change: "-2%", icon: Clock, color: "text-amber-500" },
];

const sourceData = [
  { name: "Website", value: 400 },
  { name: "Referral", value: 300 },
  { name: "Email", value: 200 },
  { name: "LinkedIn", value: 150 },
];

const COLORS = ["#7c3aed", "#d8b4fe", "#4f46e5", "#a78bfa"];

const growthData = [
  { month: "Jan", leads: 65 },
  { month: "Feb", leads: 85 },
  { month: "Mar", leads: 110 },
  { month: "Apr", leads: 95 },
  { month: "May", leads: 140 },
  { month: "Jun", leads: 175 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-8"
    >
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome back, Admin</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your leads today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Reports</Button>
          <Button className="bg-primary hover:bg-primary/90">Refresh Dashboard</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-background border border-border ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-green-500 flex items-center gap-0.5">
                    {stat.change}
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold font-headline">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <motion.div className="lg:col-span-2" variants={item}>
          <Card className="bg-card/50 border-border h-full">
            <CardHeader>
              <CardTitle className="font-headline">Lead Growth</CardTitle>
              <CardDescription>Monthly new lead acquisition over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                    itemStyle={{ color: "#7c3aed" }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Source Distribution */}
        <motion.div variants={item}>
          <Card className="bg-card/50 border-border h-full">
            <CardHeader>
              <CardTitle className="font-headline">Lead Sources</CardTitle>
              <CardDescription>Breakdown of acquisition channels</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {sourceData.map((source, idx) => (
                  <div key={source.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-sm font-medium">{source.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card className="bg-card/50 border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
                <CardDescription>Latest updates across your workspace</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {MOCK_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center border border-border">
                        {activity.type === 'note' && <Clock className="w-4 h-4 text-blue-500" />}
                        {activity.type === 'status' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {activity.type === 'lead' && <Users className="w-4 h-4 text-purple-500" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold">{activity.leadName}</span>
                        <span className="text-[10px] text-muted-foreground">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div variants={item}>
          <Card className="bg-card/50 border-border h-full">
            <CardHeader>
              <CardTitle className="font-headline">Follow-ups Due Today</CardTitle>
              <CardDescription>Immediate actions required</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Follow up with Client {i}</p>
                        <p className="text-xs text-muted-foreground">Due at 2:00 PM</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 border-dashed border-2 hover:border-primary hover:text-primary transition-all">
                  + Schedule More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
