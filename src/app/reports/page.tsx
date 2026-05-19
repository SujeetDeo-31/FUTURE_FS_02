"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Calendar, Download, TrendingUp, Users, Target, FileText, Sparkles, ChevronRight, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { useCRMStats, TimeRange } from "@/hooks/use-crm-stats";
import { GlassCard } from "@/components/shared/glass-card";
import { BackButton } from "@/components/shared/back-button";
import { ReportService } from "@/services/report-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const COLORS = ["#7c3aed", "#d8b4fe", "#4f46e5", "#a78bfa", "#6366f1", "#8b5cf6"];

const RANGE_LABELS: Record<TimeRange, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  'year': 'This Year',
  'all': 'All Time'
};

/**
 * Simple component to render text with bold markdown tags (**text**) as <strong> elements.
 */
function FormattedText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState<TimeRange>('30d');
  const { stats, loading: statsLoading } = useCRMStats(range);
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      const data = await ReportService.getReports();
      setReports(data);
      if (data.length > 0 && !selectedReport) setSelectedReport(data[0]);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openDeleteDialog = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setReportToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    
    const id = reportToDelete;
    setIsDeleting(id);
    try {
      await ReportService.deleteReport(id);
      setReports(prev => prev.filter(r => r._id !== id));
      if (selectedReport?._id === id) {
        setSelectedReport(null);
      }
      toast({ title: "Success", description: "Report deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete report", variant: "destructive" });
    } finally {
      setIsDeleting(null);
      setReportToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  if (statsLoading) {
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
    <div className="space-y-8 pb-20">
      <BackButton />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline text-white tracking-tight">Intelligence Hub</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review your pipeline performance and AI strategic briefings.</p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-white/10 h-11 px-4 rounded-xl">
                <Calendar className="w-4 h-4" /> {RANGE_LABELS[range]}
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
          
          <Button className="bg-primary hover:bg-primary/90 gap-2 h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> Export Suite
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Target className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Conversion Rate</p>
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
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Selected Volume</p>
            </div>
            <h3 className="text-4xl font-bold font-headline text-white">{stats?.totalLeads || 0}</h3>
            <div className="mt-2 text-xs text-muted-foreground font-medium">Contacts in selected period</div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wins This Period</p>
            </div>
            <h3 className="text-4xl font-bold font-headline text-white">{stats?.convertedCount || 0}</h3>
            <div className="mt-2 text-xs text-violet-400 font-bold">Successfully Converted</div>
          </CardContent>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <GlassCard className="bg-primary/[0.02] border-primary/20">
                  <div className="p-8 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 rounded-lg">
                          AI GENERATED BRIEF
                        </Badge>
                        <h2 className="text-3xl font-bold text-white font-headline">{selectedReport.title}</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> {new Date(selectedReport.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="text-center px-4 border-r border-white/5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Leads</p>
                          <p className="text-xl font-bold text-white">{selectedReport.statsSnapshot?.totalLeads}</p>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Conv.</p>
                          <p className="text-xl font-bold text-primary">{selectedReport.statsSnapshot?.conversionRate?.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 leading-relaxed text-white/90 font-medium italic">
                      "<FormattedText text={selectedReport.summary} />"
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-primary" /> Key Insights
                        </h3>
                        <div className="space-y-4">
                          {selectedReport.insights.map((insight: string, i: number) => (
                            <div key={i} className="flex gap-3 text-sm text-muted-foreground leading-snug">
                              <span className="text-primary font-bold">0{i+1}.</span>
                              <p><FormattedText text={insight} /></p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-5">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-primary" /> Strategic Actions
                        </h3>
                        <div className="space-y-4">
                          {selectedReport.recommendations.map((rec: string, i: number) => (
                            <div key={i} className="flex gap-3 text-sm text-white font-medium p-3.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                              <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <p><FormattedText text={rec} /></p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard className="h-[350px]">
                    <CardHeader>
                      <CardTitle className="font-headline text-lg text-white">Funnel Velocity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.growthData || []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                          <XAxis dataKey="month" stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #ffffff10", borderRadius: "8px" }} />
                          <Bar dataKey="leads" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Volume" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </GlassCard>
                  <GlassCard className="h-[350px]">
                    <CardHeader>
                      <CardTitle className="font-headline text-lg text-white">Source Yield</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats?.sourceData || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {(stats?.sourceData || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </GlassCard>
                </div>
              </motion.div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <FileText className="w-12 h-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground text-sm font-medium">No reports generated yet. Use the dashboard to start analysis.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="h-full">
            <div className="p-6 space-y-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Report History
              </h3>
              
              <div className="space-y-4">
                {loadingReports ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                  ))
                ) : reports.map((report) => (
                  <div key={report._id} className="relative group">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedReport?._id === report._id 
                          ? 'bg-primary/10 border-primary/40' 
                          : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        {selectedReport?._id === report._id && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                      </div>
                      <p className={`text-sm font-bold truncate transition-colors ${
                        selectedReport?._id === report._id ? 'text-primary' : 'text-white'
                      }`}>
                        {report.title}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                         <span className="text-[10px] text-muted-foreground/60">{report.statsSnapshot?.totalLeads} Leads Analysed</span>
                         <ChevronRight className={`w-3 h-3 transition-transform ${selectedReport?._id === report._id ? 'text-primary' : 'text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                      </div>
                    </button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all rounded-lg"
                      onClick={(e) => openDeleteDialog(e, report._id)}
                      disabled={isDeleting === report._id}
                    >
                      {isDeleting === report._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                ))}

                {reports.length === 0 && !loadingReports && (
                  <div className="py-12 text-center text-[10px] text-muted-foreground uppercase tracking-widest italic">
                    Pipeline history empty
                  </div>
                )}
              </div>

              <Separator className="bg-white/5" />
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">AI Utilization</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every generated report uses 25 AI Credits to perform a deep-scan of your pipeline's strategic health.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-popover/95 backdrop-blur-2xl border-white/10 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold font-headline text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
              This action cannot be undone. This will permanently delete this report from your analysis history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-11 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-bold h-11 rounded-xl border-none shadow-lg shadow-red-500/20"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
