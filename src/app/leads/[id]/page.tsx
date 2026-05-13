"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Phone, 
  Building2, 
  MessageSquare, 
  History, 
  Sparkles,
  Save,
  PenSquare,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LeadStatus, Lead } from "@/types/crm";
import { aiNextActionSuggestion, AiNextActionSuggestionOutput } from "@/ai/flows/ai-next-action-suggestion";

const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Qualified: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Proposal Sent": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  Converted: "bg-green-500/10 text-green-500 border-green-500/20",
  Lost: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiNextActionSuggestionOutput | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(`/api/leads/${id}`);
        if (!response.ok) throw new Error('Lead not found');
        const data = await response.json();
        setLead(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const generateAiNextAction = async () => {
    if (!lead) return;
    setIsAiLoading(true);
    try {
      const result = await aiNextActionSuggestion({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: lead.source,
        status: lead.status as any,
        priority: lead.priority as any,
        notesHistory: lead.notesHistory?.map(n => ({ timestamp: n.timestamp, note: n.content })) || [],
        createdAt: lead.createdAt,
      });
      setAiSuggestion(result);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading lead data...</div>;
  if (!lead) return <div className="p-8 text-center">Lead not found.</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/leads">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-headline">{lead.name}</h1>
            <Badge variant="outline" className={statusColors[lead.status]}>{lead.status}</Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{lead.priority} Priority</Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4" /> {lead.company} • Added on {new Date(lead.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <PenSquare className="w-4 h-4" /> Edit Lead
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Save className="w-4 h-4" /> Save Activity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-semibold">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone Number</p>
                    <p className="text-sm font-semibold">{lead.phone || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Follow-up Date</p>
                    <p className="text-sm font-semibold">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'None scheduled'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Source</p>
                    <p className="text-sm font-semibold">{lead.source}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="bg-muted/50 border border-border w-full justify-start p-1 h-auto gap-1">
              <TabsTrigger value="timeline" className="gap-2 px-4 py-2 data-[state=active]:bg-background">
                <History className="w-4 h-4" /> Activity Timeline
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-2 px-4 py-2 data-[state=active]:bg-background">
                <MessageSquare className="w-4 h-4" /> Notes & Comms
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-6">
              <Card className="bg-card/30 border-border">
                <CardContent className="p-6">
                  <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
                    {lead.statusHistory?.map((status, idx) => (
                      <div key={idx} className="relative flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="relative z-10 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">Status Update</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Status changed from <span className="text-foreground font-medium">'{status.oldStatus}'</span> to <span className="text-foreground font-medium">'{status.newStatus}'</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border">
                          {new Date(status.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {lead.notesHistory?.map((note, idx) => (
                      <div key={`note-${idx}`} className="relative flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="relative z-10 w-10 h-10 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">Note Added</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{note.content}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-6 space-y-6">
              <Card className="bg-card/30 border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">New Activity Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    placeholder="Type your meeting notes or call log here..." 
                    className="min-h-[120px] bg-background/50 border-border focus-visible:ring-primary"
                  />
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost">Clear</Button>
                    <Button className="bg-primary hover:bg-primary/90">Add Note</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> AI Next Action
                </CardTitle>
                <Badge className="bg-primary text-white">PRO</Badge>
              </div>
              <CardDescription className="text-primary/70">Intelligent strategy based on lead history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSuggestion ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="p-3 bg-background/60 rounded-lg border border-primary/20">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Suggested Action</p>
                    <p className="text-sm font-medium leading-relaxed">{aiSuggestion.suggestedAction}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Strategy Reasoning</p>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">"{aiSuggestion.reasoning}"</p>
                  </div>
                  {aiSuggestion.suggestedCommunicationStrategy && (
                    <div className="p-3 bg-accent/20 rounded-lg border border-accent/30">
                      <p className="text-xs font-semibold text-accent-foreground uppercase tracking-wider mb-2">Communication Strategy</p>
                      <p className="text-sm text-accent-foreground/90">{aiSuggestion.suggestedCommunicationStrategy}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                    <span className="text-[10px] text-muted-foreground">Confidence: {aiSuggestion.confidenceScore}%</span>
                    <Button size="sm" variant="ghost" className="h-8 text-[11px] font-bold text-primary hover:bg-primary/10 px-2">
                      Apply Suggestion <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Let AI analyze this lead and suggest the best next step to close the deal.</p>
                  <Button 
                    onClick={generateAiNextAction} 
                    disabled={isAiLoading}
                    className="w-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 gap-2 py-6 text-base font-bold"
                  >
                    {isAiLoading ? "Analyzing..." : <>Analyze Lead with AI <Sparkles className="w-4 h-4" /></>}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3 h-11 border-border bg-background/50 hover:border-primary/50 transition-all">
                <Mail className="w-4 h-4 text-primary" /> Draft Follow-up Email
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-11 border-border bg-background/50 hover:border-primary/50 transition-all">
                <Calendar className="w-4 h-4 text-primary" /> Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-11 border-border bg-background/50 hover:border-primary/50 transition-all">
                <Phone className="w-4 h-4 text-primary" /> Log Call Attempt
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}