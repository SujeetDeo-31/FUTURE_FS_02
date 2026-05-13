"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus,
  ArrowUpDown,
  Mail,
  ExternalLink,
  Briefcase,
  User,
  Zap,
  Calendar
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_LEADS, LeadStatus, LeadPriority } from "@/lib/mock-data";

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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = MOCK_LEADS.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-white">Lead Manager</h1>
          <p className="text-muted-foreground mt-1.5 text-base">Visualize and manage your entire sales pipeline.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-5 shadow-xl shadow-primary/20 gap-2">
          <Plus className="w-4 h-4" /> Add Lead
        </Button>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 h-10 rounded-xl" 
            placeholder="Search leads by name, company, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-10 px-4 border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl gap-2 flex-1 sm:flex-none">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" /> Filters
          </Button>
          <Button variant="outline" className="h-10 px-4 border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl gap-2 flex-1 sm:flex-none">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" /> Sort
          </Button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl"
      >
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="font-bold text-white py-4 pl-6 text-[11px] uppercase tracking-widest opacity-50">Lead Name</TableHead>
              <TableHead className="font-bold text-white py-4 text-[11px] uppercase tracking-widest opacity-50">Company</TableHead>
              <TableHead className="font-bold text-white py-4 text-[11px] uppercase tracking-widest opacity-50">Status</TableHead>
              <TableHead className="font-bold text-white py-4 text-[11px] uppercase tracking-widest opacity-50">Priority</TableHead>
              <TableHead className="font-bold text-white py-4 text-[11px] uppercase tracking-widest opacity-50">Assigned To</TableHead>
              <TableHead className="font-bold text-white py-4 text-right pr-6 text-[11px] uppercase tracking-widest opacity-50">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredLeads.map((lead, idx) => (
                <TableRow 
                  key={lead.id} 
                  className="hover:bg-white/[0.04] transition-all border-white/5 group cursor-pointer"
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white group-hover:text-primary transition-colors">{lead.name}</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="w-2.5 h-2.5 opacity-50" /> {lead.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-white/80 font-medium">{lead.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0 border-none", statusColors[lead.status])}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0 border-none rounded-sm", priorityColors[lead.priority])}>
                      {lead.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-white/10">
                        {lead.assignedTo.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-white/70">{lead.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" asChild>
                        <Link href={`/leads/${lead.id}`}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover/90 backdrop-blur-xl border-white/10">
                          <DropdownMenuItem className="text-xs focus:bg-primary/10 focus:text-primary">Edit Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs focus:bg-primary/10 focus:text-primary">Schedule Task</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs focus:bg-primary/10 focus:text-primary">Send Email</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs text-destructive focus:bg-destructive/10 focus:text-destructive">Delete Lead</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredLeads.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <Zap className="w-6 h-6 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-white font-bold text-lg">No matches found</h3>
            <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or search keywords.</p>
            <Button variant="ghost" className="mt-4 text-primary font-bold hover:bg-primary/10" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}