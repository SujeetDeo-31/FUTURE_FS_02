'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lead, LeadNote } from '@/types/crm';
import { LeadService } from '@/services/lead-service';
import { AccountService } from '@/services/account-service';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Tag, 
  Flag, 
  Paperclip, 
  Plus, 
  Save, 
  Trash2,
  Edit
} from 'lucide-react';

import { GlassCard } from '@/components/shared/glass-card';
import { BackButton } from '@/components/shared/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

  if (!lead) {
    return <div className="text-center py-20 text-muted-foreground">Loading lead...</div>;
  }

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 mt-1 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
        <p className="text-sm text-white font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <BackButton />

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline text-white">{lead.name}</h1>
          <p className="text-muted-foreground mt-1.5">Lead details and activity timeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="w-4 h-4"/>
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="destructive" className="gap-2" onClick={handleDeleteLead} disabled={isDeleting}>
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <GlassCard>
              <form onSubmit={handleSubmit(handleUpdateLead)} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input placeholder="Name" {...register('name')} />
                  <Input placeholder="Email" {...register('email')} />
                  <Input placeholder="Phone" {...register('phone')} />
                  <Input placeholder="Company" {...register('company')} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                   />
                   <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                   />
                   <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Cold Call">Cold Call</SelectItem>
                            <SelectItem value="Advertisement">Advertisement</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="assignedTo"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select an owner" /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="Unassigned">Unassigned</SelectItem>
                             {adminName && <SelectItem value={adminName}>{adminName}</SelectItem>}
                          </SelectContent>
                        </Select>
                      )}
                   />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>Save Changes</Button>
                </div>
              </form>
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                <DetailItem icon={User} label="Full Name" value={lead.name} />
                <DetailItem icon={Mail} label="Email" value={lead.email} />
                <DetailItem icon={Phone} label="Phone" value={lead.phone} />
                <DetailItem icon={Building} label="Company" value={lead.company} />
                <DetailItem icon={Calendar} label="Created At" value={new Date(lead.createdAt).toLocaleDateString()} />
                <DetailItem icon={User} label="Owner" value={lead.assignedTo} />
              </div>
            </GlassCard>
          )}
          
          <GlassCard>
            <div className="p-8">
              <h2 className="text-xl font-bold text-white mb-4">Activity Feed</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Add a new note..." 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                    <Button 
                      size="sm" 
                      className="mt-2 float-right" 
                      onClick={handleAddNote}
                      disabled={isSavingNote}
                    >
                      {isSavingNote ? 'Saving...' : 'Save Note'}
                    </Button>
                  </div>
                </div>
                {(lead.notes || []).sort((a: LeadNote, b: LeadNote) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note: LeadNote) => (
                  <div key={note._id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center text-muted-foreground">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.createdAt).toLocaleString()} by {note.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <aside className="space-y-6">
          <GlassCard>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Lead Properties</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-400">{lead.status}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-400">{lead.priority}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Source</span>
                  <span className="text-white font-medium">{lead.source}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}