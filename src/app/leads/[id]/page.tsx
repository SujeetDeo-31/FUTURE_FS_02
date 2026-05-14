
"use client";

import { use, useState, useEffect, useCallback } from "react";
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
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadStatus, LeadPriority, Lead } from "@/types/crm";
import { aiNextActionSuggestion, AiNextActionSuggestionOutput } from "@/ai/flows/ai-next-action-suggestion";
import { LeadService } from "@/services/lead-service";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/shared/back-button";

const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Qualified: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Proposal Sent": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  Converted: "bg-green-500/10 text-green-400 border-green-500/20",
  Lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiNextActionSuggestionOutput | null>(null);
  
  const [newNote, setNewNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);
  const [editData, setEditData] = useState<Partial<Lead>>({});

  const fetchLead = useCallback(async () => {
    try {
      const response = await fetch(`/api/leads/${id}`);
      if (!response.ok) throw new Error('Lead not found');
      const data = await response.json();
      setLead(data);
      setEditData(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load lead details.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    setIsUpdatingLead(true);
    try {
      await LeadService.updateLead(id, editData);
      toast({ title: "Success", description: "Lead updated successfully." });
      setIsEditDialogOpen(false);
      fetchLead();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update lead.", variant: "destructive" });
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !lead) return;
    setIsSavingNote(true);
    try {
      await LeadService.addNote(id, newNote);
      setNewNote("");
      toast({ title: "Note Saved", description: "The activity has been logged." });
      fetchLead();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save note.", variant: "destructive" });
    } finally {
      setIsSavingNote(false);
    }
  };

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
        notesHistory: lead.notesHistory?.map(n => ({ timestamp: n.timestamp || n.createdAt || '', note: n.content })) || [],
        createdAt: lead.createdAt,
      });
      setAiSuggestion(result);
    } catch (error) {
      console.error("AI Error:", error);
      toast({ title: "AI Unavailable", description: "Could not generate suggestion at this time.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse">Fetching lead records...</p>
    </div>
  );
  
  if (!lead) return (
    <div className="p-20 text-center space-y-4">
      <h2 className="text-2xl font-bold">Lead not found</h2>
      <Button asChild variant="outline"><Link href="/leads">Return to Lead Manager</Link></Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-1">
        <BackButton />
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-headline text-white">{lead.name}</h1>
                <Badge variant="outline" className={statusColors[lead.status]}>{lead.status}</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{lead.priority} Priority</Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4" /> {lead.company} • Added on {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5 px-6 h-11" onClick={() => setIsEditDialogOpen(true)}>
              <PenSquare className="w-4 h-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Email Address</p>
                    <p className="text-sm font-semibold text-white">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Phone Number</p>
                    <p className="text-sm font-semibold text-white">{lead.phone || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <Calendar className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Follow-up Date</p>
                    <p className="text-sm font-semibold text-white">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'None scheduled'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <Building2 className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Acquisition Source</p>
                    <p className="text-sm font-semibold text-white">{lead.source}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-auto gap-1">
              <TabsTrigger value="timeline" className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <History className="w-4 h-4" /> Activity Timeline
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <MessageSquare className="w-4 h-4" /> Notes & Log
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-6">
              <Card className="bg-white/[0.01] border-white/5">
                <CardContent className="p-8">
                  <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px before:h-full before:w-0.5 before:bg-white/5">
                    {lead.statusHistory?.map((status, idx) => (
                      <div key={`status-${idx}`} className="relative flex items-start justify-between gap-6 group">
                        <div className="flex items-start gap-6">
                          <div className="relative z-10 w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center group-hover:border-primary transition-colors">
                            <History className="w-4 h-4 text-primary" />
                          </div>
                          <div className="pt-1">
                            <p className="text-sm font-bold text-white">Pipeline Shift</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Status changed from <span className="text-white/80">{status.oldStatus}</span> to <span className="text-primary font-bold">{status.newStatus}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/5 whitespace-nowrap">
                          {new Date(status.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {lead.notesHistory?.map((note, idx) => (
                      <div key={`note-${idx}`} className="relative flex items-start justify-between gap-6 group">
                        <div className="flex items-start gap-6">
                          <div className="relative z-10 w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center group-hover:border-accent transition-colors">
                            <MessageSquare className="w-4 h-4 text-accent" />
                          </div>
                          <div className="pt-1">
                            <p className="text-sm font-bold text-white">Note Logged</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-md">{note.content}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/5 whitespace-nowrap">
                          {new Date(note.createdAt || note.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-6 space-y-6">
              <Card className="bg-white/[0.02] border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg font-headline text-white">Log New Interaction</CardTitle>
                  <CardDescription>Document calls, meetings, or general updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    placeholder="Briefly describe the interaction..." 
                    className="min-h-[120px] bg-white/5 border-white/10 focus-visible:ring-primary rounded-xl resize-none"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setNewNote("")} className="hover:bg-white/5">Clear</Button>
                    <Button 
                      className="bg-primary hover:bg-primary/90 min-w-[140px] h-11" 
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || isSavingNote}
                    >
                      {isSavingNote ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                      Save Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-headline flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-primary" /> Intelligence
                </CardTitle>
                <Badge className="bg-primary text-white text-[10px] font-bold px-2 py-0">AUTO</Badge>
              </div>
              <CardDescription className="text-primary/70 text-xs">Proprietary lead closing strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSuggestion ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="p-4 bg-black/40 rounded-xl border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Next Step</p>
                    <p className="text-sm font-semibold text-white leading-relaxed">{aiSuggestion.suggestedAction}</p>
                  </div>
                  <div className="space-y-2 px-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Analysis Reasoning</p>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">"{aiSuggestion.reasoning}"</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-muted-foreground">Confidence: {aiSuggestion.confidenceScore}%</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed px-4">
                    Analyze behavioral history and status velocity to predict the optimal next move.
                  </p>
                  <Button 
                    onClick={generateAiNextAction} 
                    disabled={isAiLoading}
                    className="w-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2 h-12 font-bold transition-all"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Run Diagnosis</>}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-popover/95 backdrop-blur-2xl border-white/10 rounded-2xl p-0 overflow-hidden">
          <form onSubmit={handleUpdateLead}>
            <DialogHeader className="p-6 bg-white/[0.02] border-b border-white/5">
              <DialogTitle className="text-xl font-bold font-headline text-white">Edit Profile</DialogTitle>
              <DialogDescription>Update record details for {lead.name}</DialogDescription>
            </DialogHeader>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} className="bg-white/5 border-white/10 h-11" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Company</Label>
                <Input value={editData.company || ''} onChange={(e) => setEditData({...editData, company: e.target.value})} className="bg-white/5 border-white/10 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <Input value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="bg-white/5 border-white/10 h-11" type="email" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <Input value={editData.phone || ''} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="bg-white/5 border-white/10 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pipeline Status</Label>
                <Select value={editData.status} onValueChange={(v) => setEditData({...editData, status: v as LeadStatus})}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-white/10">
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Priority</Label>
                <Select value={editData.priority} onValueChange={(v) => setEditData({...editData, priority: v as LeadPriority})}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-white/10">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-6 bg-white/[0.02] border-t border-white/5 gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="hover:bg-white/5">Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 px-8 min-w-[140px]" disabled={isUpdatingLead}>
                {isUpdatingLead ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Update Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
