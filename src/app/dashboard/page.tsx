
"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Clock, 
  ArrowUpRight, 
  Zap,
  TrendingUp,
  ChevronRight,
  Filter
} from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import { GlassCard } from "@/components/shared/glass-card";

const stats = [
  { label: "Total Leads", value: "1,284", change: "+12.5%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Converted", value: "432", change: "+8.2%", icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "New Leads", value: "48", change: "+18%", icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
  { label: "Follow-ups", value: "12", change: "-2%", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
];

const sourceData = [
  { name: "Website", value: 400 },
  { name: "Referral", value: 300 },
  { name: "LinkedIn", value: 200 },
  { name: "Email", value: 150 },
];

const COLORS = ["#8b5cf6", "#a78bfa", "#6366f1", "#4f46e5"];

const growthData = [
  { month: "Jan", leads: 65 },
  { month: "Feb", leads: 85 },
  { month: "Mar", leads: 110 },
  { month: "Apr", leads: 95 },
  { month: "May", leads: 140 },
  { month: "Jun", leads: 175 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Intelligence Hub</h1>
          <p className="text-muted-foreground mt-2 text-lg">Monitor your sales pipeline with real-time analytics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-5 border-white/10 hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" /> Filter Range
          </Button>
          <Button className="h-11 px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            Generate Report
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={stat.label} delay={idx * 0.05}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0.5">
                  {stat.change} <ArrowUpRight className="w-3 h-3 ml-1" />
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold font-headline">{stat.value}</h3>
              </div>
            </CardContent>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Acquisition Velocity</CardTitle>
              <CardDescription>New lead growth trend over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)" }}
                    itemStyle={{ color: "#8b5cf6" }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </GlassCard>
        </div>

        {/* Source Distribution */}
        <div>
          <GlassCard className="h-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Channel Performance</CardTitle>
              <CardDescription>Volume by lead source</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full mt-6 px-4">
                {sourceData.map((source, idx) => (
                  <div key={source.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-sm font-medium text-slate-300">{source.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        {/* Recent Activity */}
        <GlassCard>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-xl">Pulse Feed</CardTitle>
              <CardDescription>Live workspace events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/10">Explore All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-colors">
                      {activity.type === 'note' && <Clock className="w-5 h-5 text-blue-400" />}
                      {activity.type === 'status' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                      {activity.type === 'lead' && <Users className="w-5 h-5 text-violet-400" />}
                    </div>
                  </div>
                  <div className="flex-1 border-b border-white/5 pb-4 group-last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-100">{activity.leadName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{activity.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>

        {/* Action Queue */}
        <GlassCard>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Priority Queue</CardTitle>
            <CardDescription>High-impact tasks for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-100">Sync with Strategic Lead {i}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Scheduled for 14:00 • High Priority</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full h-12 mt-6 border-dashed border-2 border-white/10 hover:border-primary hover:bg-primary/5 transition-all text-slate-400 hover:text-primary font-bold">
                + Schedule Follow-up
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
