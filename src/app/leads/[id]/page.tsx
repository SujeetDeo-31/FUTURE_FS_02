
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadNote } from '@/types/crm';
import { LeadService } from '@/services/lead-service';
import { AccountService } from '@/services/account-service';
import { summarizeLeadActivity } from '@/ai/flows/ai-lead-activity-summary';
import { aiNextActionSuggestion } from '@/ai/flows/ai-next-action-suggestion';
import { aiPersonalizedEmailDraft } from '@/ai/flows/ai-personalized-email-draft';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Plus, 
  Trash2,
  Edit,
  Sparkles,
  Zap,
  MessageSquare,
  FileText,
  Loader2,
  ArrowRight
} from 'lucide-react';

import { GlassCard } from '@/components/shared/glass-card';
import { BackButton } from '@/components/shared/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost']),
  priority: z.enum(['Low', 'Medium', 'High']),
  source: z.string(),
  assignedTo: z.string()
});

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // AI State
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [aiEmail, setAiEmail] = useState<any>(null);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema)
  });

  const fetchLeadAndAdmin = async () => {
    try {
      const [leadData, admin] = await Promise.all([
        LeadService.getLeadById(leadId),
        AccountService.getAccount()
      ]);
      setLead(leadData);
      reset(leadData);
      if(admin && admin.name) {
        setAdminName(admin.name);
      }
    } catch (error) {
      toast.error('Failed to load lead details.');
      router.push('/leads');
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchLeadAndAdmin();
    }
  }, [leadId]);

  const handleUpdateLead = async (data: z.infer<typeof leadSchema>) => {
    try {
      await LeadService.updateLead(leadId, data);
      toast.success('Lead updated successfully');
      setIsEditing(false);
      fetchLeadAndAdmin();
    } catch (error) {
      toast.error('Failed to update lead');
    }
  };

  const handleDeleteLead = async () => {
    setIsDeleting(true);
    try {
      await LeadService.deleteLead(leadId);
      toast.success('Lead deleted successfully');
      router.push('/leads');
    } catch (error) {
      toast.error('Failed to delete lead');
      setIsDeleting(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSavingNote(true);
    try {
      const updatedLead = await LeadService.addNote(leadId, newNote);
      setLead(updatedLead);
      setNewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setIsSavingNote(false);
    }
  };

  // AI Handlers
  const handleGenerateSummary = async () => {
    if (!lead) return;
    setIsSummarizing(true);
    try {
      await AccountService.deductCredits(10);
      const result = await summarizeLeadActivity({
        leadName: lead.name,
        notes: lead.notes.map(n => ({ timestamp: n.createdAt, content: n.content })),
        statusHistory: [], // Placeholder for history
        followUpHistory: [] // Placeholder
      });
      setAiSummary(result.summary);
      window.dispatchEvent(new Event('profileUpdated')); // Refresh sidebar credits
      toast.success('Activity summary generated (10 credits)');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGetSuggestion = async () => {
    if (!lead) return;
    setIsSuggesting(true);
    try {
      await AccountService.deductCredits(15);
      const result = await aiNextActionSuggestion({
        name: lead.name,
        email: lead.email,
        company: lead.company,
        source: lead.source,
        status: lead.status as any,
        priority: lead.priority as any,
        createdAt: lead.createdAt,
        notesHistory: lead.notes.map(n => ({ timestamp: n.createdAt, note: n.content }))
      });
      setAiSuggestion(result);
      window.dispatchEvent(new Event('profileUpdated'));
      toast.success('Intelligence analysis complete (15 credits)');
    } catch (error: any) {
      toast.error(error.message || 'Failed to get suggestion');
    } finally {
      setIsSuggesting(false);
    }
  };

  if (!lead) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 mt-1 text-muted-foreground" />
      <div>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{label}</p>
        <p className="text-sm text-white font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <BackButton />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-bold font-headline text-white tracking-tight">{lead.name}</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {lead.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Lead ID: {lead._id?.substring(0, 8)} • Last updated {new Date(lead.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-white/10 hover:bg-white/5 font-bold gap-2 rounded-xl" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="w-4 h-4"/>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button variant="destructive" className="h-10 font-bold gap-2 rounded-xl shadow-lg shadow-red-500/10" onClick={handleDeleteLead} disabled={isDeleting}>
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Remove'}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 rounded-xl h-12">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary px-6 font-bold">Overview</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-primary px-6 font-bold">Activity Feed</TabsTrigger>
              <TabsTrigger value="intelligence" className="rounded-lg data-[state=active]:bg-primary px-6 font-bold flex gap-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 outline-none">
              <GlassCard>
                <div className="p-8">
                  {isEditing ? (
                    <form onSubmit={handleSubmit(handleUpdateLead)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input placeholder="Name" {...register('name')} className="bg-white/5 border-white/10" />
                        <Input placeholder="Email" {...register('email')} className="bg-white/5 border-white/10" />
                        <Input placeholder="Phone" {...register('phone')} className="bg-white/5 border-white/10" />
                        <Input placeholder="Company" {...register('company')} className="bg-white/5 border-white/10" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-popover/95 border-white/10">
                                  {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )}
                         />
                         <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-popover/95 border-white/10">
                                  {['Low', 'Medium', 'High'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )}
                         />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Discard</Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 font-bold px-8 shadow-lg shadow-primary/20" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                      <DetailItem icon={User} label="Full Name" value={lead.name} />
                      <DetailItem icon={Mail} label="Email" value={lead.email} />
                      <DetailItem icon={Phone} label="Phone" value={lead.phone} />
                      <DetailItem icon={Building} label="Company" value={lead.company} />
                      <DetailItem icon={Calendar} label="First Contact" value={new Date(lead.createdAt).toLocaleDateString()} />
                      <DetailItem icon={User} label="Pipeline Owner" value={lead.assignedTo} />
                    </div>
                  )}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="activity" className="mt-0 outline-none">
              <GlassCard>
                <div className="p-8 space-y-8">
                  <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <Textarea 
                        placeholder="Type a new activity note here..." 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="bg-transparent border-none focus-visible:ring-0 p-0 min-h-[60px] resize-none text-sm"
                      />
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 font-bold px-6 h-9 rounded-lg" 
                          onClick={handleAddNote}
                          disabled={isSavingNote || !newNote.trim()}
                        >
                          {isSavingNote ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Add Note'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {lead.notes.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground/50 italic text-sm">
                        No activity recorded yet.
                      </div>
                    )}
                    {lead.notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note, idx) => (
                      <motion.div 
                        key={note._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 group"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-colors">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          </div>
                          {idx !== lead.notes.length - 1 && <div className="w-[1px] flex-1 bg-white/10 my-1" />}
                        </div>
                        <div className="pb-8">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white/90">{note.author}</span>
                            <span className="text-[10px] text-muted-foreground">• {new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-white/80 transition-colors">{note.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="intelligence" className="mt-0 outline-none space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="bg-primary/5 border-primary/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Next Action</h3>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 text-primary" onClick={handleGetSuggestion} disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                        Analyze
                      </Button>
                    </div>
                    <AnimatePresence mode="wait">
                      {aiSuggestion ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter font-bold">Recommended</p>
                            <p className="text-sm font-semibold text-white">{aiSuggestion.suggestedAction}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                            <p className="text-[11px] text-muted-foreground italic leading-relaxed">"{aiSuggestion.reasoning}"</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <p className="text-[10px] text-muted-foreground font-bold mb-1">Confidence Score</p>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${aiSuggestion.confidenceScore}%` }} className="h-full bg-primary" />
                              </div>
                            </div>
                            <span className="text-xs font-bold text-primary">{aiSuggestion.confidenceScore}%</span>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="py-8 text-center text-xs text-muted-foreground/60 italic">
                          Click analyze to get AI-powered next steps.
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlassCard>

                <GlassCard className="bg-indigo-500/5 border-indigo-500/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Activity Summary</h3>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/10 text-indigo-400" onClick={handleGenerateSummary} disabled={isSummarizing}>
                        {isSummarizing ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                        Summarize
                      </Button>
                    </div>
                    <AnimatePresence mode="wait">
                      {aiSummary ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <p className="text-sm text-white/80 leading-relaxed font-medium">{aiSummary}</p>
                        </motion.div>
                      ) : (
                        <div className="py-8 text-center text-xs text-muted-foreground/60 italic">
                          Get a condensed brief of interaction history.
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlassCard>
              </div>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Draft Smart Email</h3>
                        <p className="text-xs text-muted-foreground">Personalized outreach generated from lead context.</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-primary hover:bg-primary/90 font-bold gap-2 shadow-lg shadow-primary/20"
                      onClick={() => toast.info('Email draft feature requires desired CTA input.')}
                    >
                      Draft Outreach
                    </Button>
                  </div>
                  <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                    <Mail className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground font-medium">Drafting engine initialized. Specify a call-to-action to begin.</p>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <GlassCard className="h-auto">
            <div className="p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Badge variant="outline" className="w-2 h-2 rounded-full p-0 bg-primary border-none" />
                Pipeline Metadata
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-white transition-colors">Current Status</span>
                  <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary font-bold">{lead.status}</Badge>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-white transition-colors">Priority</span>
                  <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-400 font-bold">{lead.priority}</Badge>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-white transition-colors">Origin Source</span>
                  <span className="text-xs text-white font-bold">{lead.source}</span>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Next Follow-up</p>
                    <p className="text-sm text-white font-semibold">Dec 14, 2024</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white"><ArrowRight className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-primary/10 to-transparent">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto mb-2 border border-primary/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white">Magic Insights</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Let AI analyze this lead's communication patterns and suggest the perfect closing strategy.</p>
              <Button className="w-full bg-white text-black hover:bg-white/90 font-bold h-10 rounded-xl" onClick={handleGetSuggestion}>
                Launch Analysis
              </Button>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
