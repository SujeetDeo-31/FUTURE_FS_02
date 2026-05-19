'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '@/types/crm';
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
  Trash2,
  Edit,
  Sparkles,
  Zap,
  MessageSquare,
  FileText,
  Loader2,
  Check,
  Send,
  Trash,
  Copy,
  PenTool
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

const phoneRegex = /^[0-9+\-() ]*$/;

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: 'Invalid phone format. Letters are not allowed.',
    }),
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
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // AI State
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [aiDraft, setAiDraft] = useState<{ subject: string; body: string } | null>(null);

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
    } catch (error: any) {
      toast.error(error.message || 'Failed to update lead');
    }
  };

  const handleDeleteLead = async () => {
    if(!confirm('Are you sure you want to delete this lead?')) return;
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
      const updatedLead = await LeadService.addNote(leadId, newNote, adminName || 'Admin');
      setLead(updatedLead);
      setNewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setDeletingNoteId(noteId);
      const updatedLead = await LeadService.deleteNote(leadId, noteId);
      setLead(updatedLead);
      toast.success('Activity removed');
    } catch (error) {
      toast.error('Failed to delete activity');
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleGenerateSummary = async () => {
    if (!lead) return;
    setIsSummarizing(true);
    try {
      await AccountService.deductCredits(10);
      const result = await summarizeLeadActivity({
        leadName: lead.name,
        notes: lead.notes.map(n => ({ timestamp: n.createdAt, content: n.content })),
        statusHistory: [],
        followUpHistory: []
      });
      setAiSummary(result.summary);
      window.dispatchEvent(new Event('profileUpdated'));
      toast.success('Summary generated (10 credits)');
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
      toast.success('Analysis complete (15 credits)');
    } catch (error: any) {
      toast.error(error.message || 'Failed to get suggestion');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!lead) return;
    setIsDrafting(true);
    try {
      await AccountService.deductCredits(10);
      const result = await aiPersonalizedEmailDraft({
        leadName: lead.name,
        leadEmail: lead.email,
        leadCompany: lead.company || 'Unknown Company',
        leadSource: lead.source,
        leadStatus: lead.status as any,
        leadNotes: lead.notes.map(n => n.content).join('\n'),
        recentInteractionsSummary: aiSummary || 'Recent interactions are captured in the activity feed.',
        callToAction: lead.status === 'Proposal Sent' ? 'Review the proposal and schedule a feedback call.' : 'Schedule a discovery meeting.'
      });
      setAiDraft(result);
      window.dispatchEvent(new Event('profileUpdated'));
      toast.success('Email draft ready (10 credits)');
    } catch (error: any) {
      toast.error(error.message || 'Failed to draft email');
    } finally {
      setIsDrafting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
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
      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
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
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold font-headline text-white tracking-tight">{lead.name}</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">
              {lead.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
            Lead ID: <span className="text-white/60 font-mono">{lead._id?.substring(0, 8)}</span> • Last activity: {new Date(lead.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 border-white/10 hover:bg-white/5 font-bold gap-2 rounded-xl px-6" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="w-4 h-4"/>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button variant="destructive" className="h-11 font-bold gap-2 rounded-xl shadow-lg shadow-red-500/10 px-6" onClick={handleDeleteLead} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isDeleting ? 'Removing...' : 'Remove Lead'}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 rounded-xl h-12 inline-flex">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary px-8 font-bold">Overview</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-primary px-8 font-bold">Activity Feed</TabsTrigger>
              <TabsTrigger value="intelligence" className="rounded-lg data-[state=active]:bg-primary px-8 font-bold flex gap-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 outline-none">
              <GlassCard>
                <div className="p-8">
                  {isEditing ? (
                    <form onSubmit={handleSubmit(handleUpdateLead)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                          <Input placeholder="Name" {...register('name')} className="bg-white/5 border-white/10 h-11" />
                          {errors.name && <p className="text-[10px] text-destructive font-bold">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                          <Input placeholder="Email" {...register('email')} className="bg-white/5 border-white/10 h-11" />
                          {errors.email && <p className="text-[10px] text-destructive font-bold">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</label>
                          <Input placeholder="Phone (numbers only)" {...register('phone')} className="bg-white/5 border-white/10 h-11" />
                          {errors.phone && <p className="text-[10px] text-destructive font-bold">{errors.phone.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company</label>
                          <Input placeholder="Company" {...register('company')} className="bg-white/5 border-white/10 h-11" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                          <Controller
                              name="status"
                              control={control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="bg-white/5 border-white/10 h-11"><SelectValue /></SelectTrigger>
                                  <SelectContent className="bg-popover/95 border-white/10">
                                    {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                          />
                         </div>
                         <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Priority</label>
                          <Controller
                              name="priority"
                              control={control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="bg-white/5 border-white/10 h-11"><SelectValue /></SelectTrigger>
                                  <SelectContent className="bg-popover/95 border-white/10">
                                    {['Low', 'Medium', 'High'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                          />
                         </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Discard</Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 font-bold px-10 h-11 shadow-lg shadow-primary/20 gap-2 rounded-xl" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                      <DetailItem icon={User} label="Full Name" value={lead.name} />
                      <DetailItem icon={Mail} label="Email Address" value={lead.email} />
                      <DetailItem icon={Phone} label="Contact Phone" value={lead.phone} />
                      <DetailItem icon={Building} label="Organization" value={lead.company} />
                      <DetailItem icon={Calendar} label="First Contacted" value={new Date(lead.createdAt).toLocaleDateString()} />
                      <DetailItem icon={User} label="Account Executive" value={lead.assignedTo} />
                    </div>
                  )}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="activity" className="mt-0 outline-none">
              <div className="space-y-6">
                <GlassCard className="border-primary/20 bg-primary/[0.02]">
                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-inner">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="relative group">
                          <Textarea 
                            placeholder="Add an internal note or log a recent activity..." 
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-primary/40 min-h-[100px] resize-none text-sm rounded-xl p-4 transition-all"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            className="bg-primary hover:bg-primary/90 font-bold px-8 h-10 rounded-xl shadow-lg shadow-primary/10 gap-2" 
                            onClick={handleAddNote}
                            disabled={isSavingNote || !newNote.trim()}
                          >
                            {isSavingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Post Activity
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <div className="space-y-4 px-2">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Interaction Timeline
                  </h3>
                  <div className="space-y-4 relative">
                    <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/5 z-0" />
                    
                    {lead.notes.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground/30 italic text-sm">
                        No activity records found for this lead.
                      </div>
                    )}
                    
                    {lead.notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note, idx) => (
                      <motion.div 
                        key={note._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative z-10 flex gap-6 group"
                      >
                        <div className="shrink-0 pt-1">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all shadow-sm">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                        <GlassCard className="flex-1 border-white/5 group-hover:border-white/10 transition-all">
                          <div className="p-5 flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-white/90">{note.author}</span>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{new Date(note.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed transition-colors group-hover:text-white/80">{note.content}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              onClick={() => handleDeleteNote(note._id)}
                              disabled={deletingNoteId === note._id}
                            >
                              {deletingNoteId === note._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash className="w-3.5 h-3.5" />}
                            </Button>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="intelligence" className="mt-0 outline-none space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="bg-primary/[0.03] border-primary/20">
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/20">
                          <Zap className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Strategic Recommendation</h3>
                      </div>
                      <Button size="sm" variant="ghost" className="h-9 px-4 text-xs font-bold uppercase tracking-widest bg-primary/10 hover:bg-primary/20 text-primary border border-primary/10 rounded-lg" onClick={handleGetSuggestion} disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                        Launch Analysis
                      </Button>
                    </div>
                    
                    <div className="flex-1">
                      <AnimatePresence mode="wait">
                        {aiSuggestion ? (
                          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                            <div className="space-y-2">
                              <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">Recommended Next Step</p>
                              <p className="text-lg font-bold text-white leading-tight">{aiSuggestion.suggestedAction}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                              <p className="text-sm text-muted-foreground italic leading-relaxed">"{aiSuggestion.reasoning}"</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center">
                                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Confidence Index</p>
                                  <span className="text-xs font-bold text-primary">{aiSuggestion.confidenceScore}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${aiSuggestion.confidenceScore}%` }} className="h-full bg-gradient-to-r from-primary/60 to-primary" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                                <Zap className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm text-muted-foreground/60 max-w-[200px] leading-relaxed">Click analysis to generate predictive lead closing strategies.</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="bg-indigo-500/[0.03] border-indigo-500/20">
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Contextual Brief</h3>
                      </div>
                      <Button size="sm" variant="ghost" className="h-9 px-4 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/10 rounded-lg" onClick={handleGenerateSummary} disabled={isSummarizing}>
                        {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                        Summarize
                      </Button>
                    </div>
                    
                    <div className="flex-1">
                      <AnimatePresence mode="wait">
                        {aiSummary ? (
                          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                            <p className="text-sm text-white/90 leading-relaxed font-medium">{aiSummary}</p>
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                                <MessageSquare className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm text-muted-foreground/60 max-w-[200px] leading-relaxed">Condense months of interaction history into a quick briefing.</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="bg-emerald-500/[0.03] border-emerald-500/20">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                        <PenTool className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Email Outreach Draft</h3>
                        <p className="text-xs text-muted-foreground mt-1">AI-generated personalized engagement template</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-9 px-4 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 rounded-lg" 
                      onClick={handleGenerateDraft} 
                      disabled={isDrafting}
                    >
                      {isDrafting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                      Draft Email
                    </Button>
                  </div>

                  <AnimatePresence mode="wait">
                    {aiDraft ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                          <div className="flex-1">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Subject Line</p>
                            <p className="text-sm text-white font-medium">{aiDraft.subject}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-400" onClick={() => copyToClipboard(aiDraft.subject)}>
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="relative group">
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-400 bg-black/40" onClick={() => copyToClipboard(aiDraft.body)}>
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          <Textarea 
                            readOnly 
                            value={aiDraft.body} 
                            className="bg-black/40 border-white/5 min-h-[250px] resize-none text-sm text-white/90 leading-relaxed font-medium p-6 rounded-xl"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <div className="py-20 text-center space-y-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20 mx-auto">
                            <Mail className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm text-muted-foreground/60 max-w-[280px] mx-auto leading-relaxed">Generate a context-aware follow-up email tailored to this lead's current pipeline status.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <GlassCard className="h-auto">
            <div className="p-6 space-y-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Badge variant="outline" className="w-2.5 h-2.5 rounded-full p-0 bg-primary border-none shadow-sm shadow-primary/40 animate-pulse" />
                Pipeline Metadata
              </h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center group">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-white transition-colors">Stage</span>
                    <p className="text-xs text-white/60">Current progress</p>
                  </div>
                  <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">{lead.status}</Badge>
                </div>
                
                <Separator className="bg-white/5" />

                <div className="flex justify-between items-center group">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-white transition-colors">Priority</span>
                    <p className="text-xs text-white/60">Inquiry urgency</p>
                  </div>
                  <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-400 font-bold px-3 py-1 rounded-lg">{lead.priority}</Badge>
                </div>

                <Separator className="bg-white/5" />

                <div className="flex justify-between items-center group">
                   <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-white transition-colors">Source</span>
                    <p className="text-xs text-white/60">Initial channel</p>
                  </div>
                  <span className="text-xs text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10">{lead.source}</span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Record Created</p>
                    <p className="text-sm text-white font-semibold">{new Date(lead.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Nurture Assistant
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need help closing this lead? The AI Insights tab uses interaction history to suggest communication strategies and draft personalized emails.
              </p>
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Powered by Gemini 2.5
              </div>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
