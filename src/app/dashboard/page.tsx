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
  Filter,
  MoreVertical,
  Activity
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
  { label: "Conversion", value: "33.6%", change: "+2.4%", icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Hot Leads", value: "48", change: "+18%", icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
  { label: "Queue", value: "12", change: "-2%", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
];

const sourceData = [
  { name: "Website", value: 400 },
  { name: "Referral", value: 300 },
  { name: "LinkedIn", value: 200 },
  { name: "Direct", value: 150 },
];

const COLORS = ["#8b5cf6", "#a78bfa", "#6366f1", "#4f46e5"];

const growthData = [
  { month: "Jan", leads: 65, active: 40 },
  { month: "Feb", leads: 85, active: 55 },
  { month: "Mar", leads: 110, active: 70 },
  { month: "Apr", leads: 95, active: 65 },
  { month: "May", leads: 140, active: 90 },
  { month: "Jun", leads: 175, active: 110 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-white">Workspace</h1>
          <p className="text-muted-foreground mt-1.5 text-base">Real-time intelligence for your sales pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 px-4 border-white/10 hover:bg-white/5 bg-transparent text-sm font-semibold">
            <Filter className="w-3.5 h-3.5 mr-2 opacity-50" /> 30 Days
          </Button>
          <Button className="h-10 px-5 bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20">
            Generate Report
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={stat.label} delay={idx * 0.05}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/5 shadow-inner`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className="text-[10px] font-bold text-emerald-400">{stat.change}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1.5">{stat.label}</p>
                <h3 className="text-3xl font-bold font-headline text-white tracking-tighter">{stat.value}</h3>
              </div>
            </CardContent>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2">
          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="font-headline text-xl text-white">Acquisition Velocity</CardTitle>
                <CardDescription className="text-sm mt-1">Lead growth and active engagement</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="h-[340px] px-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#ffffff20" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10} 
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #ffffff10", borderRadius: "12px", boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.5)" }}
                    itemStyle={{ color: "#8b5cf6", fontSize: "12px" }}
                    labelStyle={{ color: "#ffffff", fontWeight: "600", marginBottom: "4px" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorLeads)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </GlassCard>
        </div>

        {/* Source Distribution */}
        <div>
          <GlassCard className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-xl text-white">Lead Attribution</CardTitle>
              <CardDescription>Top acquisition channels</CardDescription>
            </CardHeader>
            <CardContent className="h-[340px] flex flex-col items-center justify-between py-6">
              <div className="relative w-full h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={85}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white tracking-tighter">1,205</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total</span>
                </div>
              </div>
              <div className="w-full space-y-3 px-4">
                {sourceData.map((source, idx) => (
                  <div key={source.name} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-xs font-semibold text-muted-foreground group-hover:text-white transition-colors">{source.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{source.value}</span>
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
          <CardHeader className="flex flex-row items-center justify-between mb-2">
            <div>
              <CardTitle className="font-headline text-xl text-white">Live Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/10 transition-all rounded-lg">
              History
            </Button>
          </CardHeader>
          <CardContent className="px-6">
            <div className="space-y-1">
              {MOCK_ACTIVITY.map((activity, idx) => (
                <motion.div 
                  key={activity.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5"
                >
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-all shadow-inner">
                      {activity.type === 'note' && <Clock className="w-4 h-4 text-blue-400" />}
                      {activity.type === 'status' && <Activity className="w-4 h-4 text-emerald-400" />}
                      {activity.type === 'lead' && <Users className="w-4 h-4 text-violet-400" />}
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white truncate">{activity.leadName}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{activity.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal line-clamp-1 group-hover:text-white/70 transition-colors">
                      {activity.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </GlassCard>

        {/* Priority Queue */}
        <GlassCard>
          <CardHeader className="mb-2">
            <CardTitle className="font-headline text-xl text-white">Priority Queue</CardTitle>
            <CardDescription>Actions requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 1, name: "Sarah Jenkins", task: "Review Proposal", priority: "High", time: "14:00" },
              { id: 2, name: "Michael Chen", task: "Follow-up Call", priority: "Medium", time: "15:30" },
              { id: 3, name: "Elena Rodriguez", task: "Setup Demo", priority: "High", time: "16:45" },
            ].map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/10">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{item.task}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.name} • {item.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn(
                    "text-[9px] font-bold px-1.5 py-0 border-none rounded-sm",
                    item.priority === "High" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                  )}>
                    {item.priority}
                  </Badge>
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
            <Button variant="ghost" className="w-full h-10 mt-2 border-dashed border border-white/10 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary font-bold text-xs uppercase tracking-widest">
              + View All Tasks
            </Button>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}