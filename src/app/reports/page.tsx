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
  Cell,
  PieChart,
  Pie
} from "recharts";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, TrendingUp, Users, Target } from "lucide-react";
import { useCRMStats } from "@/hooks/use-crm-stats";
import { GlassCard } from "@/components/shared/glass-card";
import { BackButton } from "@/components/shared/back-button";

const COLORS = ["#7c3aed", "#d8b4fe", "#4f46e5", "#a78bfa", "#6366f1", "#8b5cf6"];

export default function ReportsPage() {
  const { stats, loading } = useCRMStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Analyzing performance metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <BackButton />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline text-white">Analytics Suite</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your sales performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-white/10">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Download className="w-4 h-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Conversion Rate</p>
            </div>
            <h3 className="text-4xl font-bold font-headline text-white">{stats?.conversionRate?.toFixed(1) || 0}%</h3>
            <div className="mt-2 text-xs text-emerald-500 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Average Efficiency
            </div>
          </CardContent>
        </GlassCard>
        
        <GlassCard>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Total Volume</p>
            </div>
            <h3 className="text-4xl font-bold font-headline text-white">{stats?.totalLeads || 0}</h3>
            <div className="mt-2 text-xs text-muted-foreground font-medium">Contacts managed in CRM</div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Wins This Period</p>
            </div>
            <h3 className="text-4xl font-bold font-headline text-white">{stats?.convertedCount || 0}</h3>
            <div className="mt-2 text-xs text-violet-400 font-bold">Successfully Converted</div>
          </CardContent>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard>
          <CardHeader>
            <CardTitle className="font-headline text-xl text-white">Monthly Funnel Performance</CardTitle>
            <CardDescription>New leads added vs total active pipeline</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.growthData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #ffffff10", borderRadius: "8px" }}
                />
                <Bar dataKey="leads" fill="#7c3aed" radius={[4, 4, 0, 0]} name="New Leads" />
                <Bar dataKey="active" fill="#d8b4fe" radius={[4, 4, 0, 0]} name="Active Leads" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="font-headline text-xl text-white">Channel Efficiency</CardTitle>
            <CardDescription>Lead volume distribution by acquisition source</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.sourceData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {(stats?.sourceData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #ffffff10", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-3xl font-bold text-white font-headline">{stats?.totalLeads || 0}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total</span>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
