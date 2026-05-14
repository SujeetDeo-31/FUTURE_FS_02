"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Plus,
  ArrowUpDown,
  Mail,
  ExternalLink,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  AlertCircle
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LeadStatus, LeadPriority, Lead } from "@/types/crm";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/shared/back-button";

const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Proposal Sent": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Converted: "bg-green-500/10 text-green-400 border-green-500/20",
  Lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

const priorityColors: Record<LeadPriority, string> = {
  High: "bg-red-500/10 text-red-400",
  Medium: "bg-amber-500/10 text-amber-400",
  Low: "bg-blue-500/10 text-blue-400",
};

export default function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const nameMatch = lead.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || false;
      const companyMatch = lead.company?.toLowerCase().includes(debouncedSearch.toLowerCase()) || false;
      const emailMatch = lead.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) || false;
      
      const matchesSearch = nameMatch || companyMatch || emailMatch;
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [leads, debouncedSearch, statusFilter, priorityFilter]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(paginatedLeads.map(l => l._id || l.id));
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedLeads) {
        await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      }
      toast({ title: "Success", description: `Deleted ${selectedLeads.length} leads.` });
      fetchLeads();
      setSelectedLeads([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Bulk delete failed.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <BackButton />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-white">Lead Manager</h1>
          <p className="text-muted-foreground mt-1.5 text-base">Visualize and manage your entire sales pipeline.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 shadow-xl shadow-primary/20 gap-2 rounded-xl" asChild>
          <Link href="/leads/new">
            <Plus className="w-4 h-4" /> Add Lead
          </Link>
        </Button>
      </header>

      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              className="pl-11 bg-white/[0.03] border-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 h-11 rounded-xl placeholder:text-muted-foreground/50" 
              placeholder="Search by name, company, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-11 bg-white/[0.03] border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-xl border-white/10">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[160px] h-11 bg-white/[0.03] border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-xl border-white/10">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-11 px-4 border-white/10 bg-white/[0.03] hover:bg-white/10 text-white font-semibold rounded-xl gap-2" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}>
              <X className="w-3.5 h-3.5 text-muted-foreground" /> Reset
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {selectedLeads.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-3 bg-primary/10 border border-primary/20 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary">{selectedLeads.length} leads selected</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs font-bold gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl relative">
        <div className="overflow-auto max-h-[600px] no-scrollbar rounded-2xl">
          <Table>
            <TableHeader className="sticky top-0 bg-sidebar-accent/80 backdrop-blur-xl z-20 shadow-sm border-b border-white/10">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[50px] py-4 pl-6">
                  <Checkbox 
                    checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead className="font-bold text-white py-4 text-[10px] uppercase tracking-widest opacity-60">Lead Details</TableHead>
                <TableHead className="font-bold text-white py-4 text-[10px] uppercase tracking-widest opacity-60">Company</TableHead>
                <TableHead className="font-bold text-white py-4 text-[10px] uppercase tracking-widest opacity-60">Status</TableHead>
                <TableHead className="font-bold text-white py-4 text-[10px] uppercase tracking-widest opacity-60">Priority</TableHead>
                <TableHead className="font-bold text-white py-4 text-[10px] uppercase tracking-widest opacity-60">Owner</TableHead>
                <TableHead className="font-bold text-white py-4 text-right pr-6 text-[10px] uppercase tracking-widest opacity-60">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-muted-foreground animate-pulse">
                      Loading pipeline data...
                    </TableCell>
                  </TableRow>
                ) : paginatedLeads.map((lead, idx) => (
                  <motion.tr 
                    key={lead._id || lead.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="hover:bg-white/[0.04] transition-all border-white/5 group"
                  >
                    <TableCell className="py-4 pl-6">
                      <Checkbox 
                        checked={selectedLeads.includes(lead._id || lead.id)}
                        onCheckedChange={() => toggleSelectLead(lead._id || lead.id)}
                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white group-hover:text-primary transition-colors cursor-pointer">
                          <Link href={`/leads/${lead._id || lead.id}`}>{lead.name}</Link>
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-2.5 h-2.5 opacity-50" /> {lead.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground/60" />
                        <span className="text-xs text-white/80 font-medium">{lead.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] font-bold px-2.5 py-0.5 border-none shadow-sm", statusColors[lead.status])}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] font-bold px-2.5 py-0.5 border-none rounded-md", priorityColors[lead.priority])}>
                        {lead.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-white/10 shadow-inner">
                          {lead.assignedTo?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-medium text-white/70">{lead.assignedTo || 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all" asChild>
                          <Link href={`/leads/${lead._id || lead.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {paginatedLeads.length === 0 && !loading && (
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 shadow-inner">
              <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-white font-bold text-xl">No leads found</h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">
              We couldn't find any leads matching your current search criteria.
            </p>
          </div>
        )}

        {filteredLeads.length > 0 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
            <p className="text-xs text-muted-foreground">
              Showing <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="text-white font-bold">{filteredLeads.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1.5 px-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      currentPage === i + 1 ? "bg-primary w-6" : "bg-white/10 hover:bg-white/30"
                    )}
                  />
                ))}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-popover/95 backdrop-blur-2xl border-white/10 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold font-headline">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
              This will permanently delete <span className="text-white font-bold">{selectedLeads.length}</span> selected leads.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-11 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
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
