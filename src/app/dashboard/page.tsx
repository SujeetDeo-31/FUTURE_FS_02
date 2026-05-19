"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Clock, 
  ArrowUpRight, 
  Zap,
  MoreVertical,
  Database,
  Filter,
  ChevronRight,
  Loader2,
  Sparkles
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlassCard } from "@/components/shared/glass-card";
import { useCRMStats, TimeRange } from "@/hooks/use-crm-stats";
import { LeadService } from "@/services/lead-service";
import { AccountService } from "@/services/account-service";
import { ReportService } from "@/services/report-service";
import { generateAiReport } from "@/ai/flows/ai-generate-report";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const COLORS = ["#8b5cf6", "#a78bfa", "#6366f1", "#4f46e5", "#3b82f6", "#10b981"];

const RANGE_LABELS: Record<TimeRange, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  'year': 'This Year',
  'all': 'All Time'
};

export default function DashboardPage() {
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>('30d');
  const { stats, leads, loading, refresh } = useCRMStats(range);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSeedData = async () => {
    try {
      await LeadService.seedSampleData();
      refresh();
      toast({ title: "Success", description: "Sample leads generated." });
    } catch (error) {
      console.error("Seeding failed", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!stats) return;
    setIsGenerating(true);
    try {
      // Deduct Credits
      await AccountService.deductCredits(25);
      
      // Call AI to analyze stats
      const aiReport = await generateAiReport({
        totalLeads: stats.totalLeads,
        conversionRate: stats.conversionRate,
        statusBreakdown: stats.statusBreakdown,
        sourceBreakdown: stats.sourceBreakdown,
      });

      // Save to database
      await ReportService.saveReport({
        ...aiReport,
        statsSnapshot: {
          totalLeads: stats.totalLeads,
          conversionRate: stats.conversionRate,
          activeLeads: stats.totalLeads - (stats.statusBreakdown['Lost'] || 0),
        }
      });

      toast({ 
        title: "Report Generated", 
        description: "Your intelligent pipeline analysis is ready. (25 AI Credits used)" 
      });
      
      router.push('/reports');
    } catch (error: any) {
      toast({ 
        title: "Action Failed", 
        description: error.message || "Failed to generate report.", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Syncing pipeline intelligence...</p>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    { label: "Active Leads", value: stats?.totalLeads || 0, change: "+12.5%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Conversion", value: `${stats?.conversionRate?.toFixed(1)}%`, change: "+2.4%", icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Qualified", value: stats?.statusBreakdown?.['Qualified'] || 0, change: "+18%", icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Overdue Follow-ups", value: stats?.followUpsDueCount || 0, change: "-2%", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-white">Workspace</h1>
          <p className="text-muted-foreground mt-1.5 text-base">Real-time intelligence for your sales pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          {(!leads || leads.length === 0) && (
            <Button onClick={handleSeedData} variant="outline" className="border-primary/20 hover:bg-primary/5 text-primary gap-2">
              <Database className="w-4 h-4" /> Seed Sample Data
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-4 border-white/10 hover:bg-white/5 bg-transparent text-sm font-semibold gap-2">
                <Filter className="w-3.5 h-3.5 opacity-50" /> {RANGE_LABELS[range]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover/90 backdrop-blur-xl border-white/10 w-48">
              {(Object.keys(RANGE_LABELS) as TimeRange[]).map((r) => (
                <DropdownMenuItem 
                  key={r} 
                  onClick={() => setRange(r)}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  {RANGE_LABELS[r]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="h-10 px-5 bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20 gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate AI Report
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, idx) => (
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
                <AreaChart data={stats?.growthData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          </AreaChart>
        </div>

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
                      data={stats?.sourceData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={85}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {(stats?.sourceData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white tracking-tighter">{stats?.totalLeads || 0}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Selected</span>
                </div>
              </div>
              <div className="w-full space-y-3 px-4">
                {(stats?.sourceData || []).map((source, idx) => (
                  <div key={source.name} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
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
        <GlassCard>
          <CardHeader className="flex flex-row items-center justify-between mb-2">
            <div>
              <CardTitle className="font-headline text-xl text-white">Latest Leads</CardTitle>
              <CardDescription>Recently added contacts in the pipeline</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/10 transition-all rounded-lg" asChild>
              <Link href="/leads">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-6">
            <div className="space-y-1">
              {leads?.slice(0, 5).map((lead, idx) => (
                <motion.div 
                  key={lead._id || lead.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5"
                >
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-all shadow-inner">
                      <Users className="w-4 h-4 text-violet-400" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white truncate">
                        <Link href={`/leads/${lead._id || lead.id}`}>{lead.name}</Link>
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal line-clamp-1 group-hover:text-white/70 transition-colors">
                      {lead.company} • {lead.status}
                    </p>
                  </div>
                </motion.div>
              ))}
              {(!leads || leads.length === 0) && (
                <div className="py-12 text-center text-muted-foreground">
                  No active leads found.
                </div>
              )}
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader className="mb-2">
            <CardTitle className="font-headline text-xl text-white">Priority Queue</CardTitle>
            <CardDescription>High priority leads requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leads?.filter(l => l.priority === 'High' && l.status !== 'Converted').slice(0, 3).map((lead, idx) => (
              <motion.div 
                key={lead._id || lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/10">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{lead.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{lead.company} • {lead.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 border-none rounded-sm bg-red-500/10 text-red-400">
                    HIGH
                  </Badge>
                  <Button variant="ghost" size="icon" className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all" asChild>
                    <Link href={`/leads/${lead._id || lead.id}`}>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
            <Button variant="ghost" className="w-full h-10 mt-2 border-dashed border border-white/10 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary font-bold text-xs uppercase tracking-widest" asChild>
              <Link href="/leads">+ View All Leads</Link>
            </Button>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}