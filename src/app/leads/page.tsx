
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus,
  ArrowUpDown,
  Phone,
  Mail,
  ExternalLink
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
  New: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Qualified: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Proposal Sent": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  Converted: "bg-green-500/10 text-green-500 border-green-500/20",
  Lost: "bg-red-500/10 text-red-500 border-red-500/20",
};

const priorityColors: Record<LeadPriority, string> = {
  High: "bg-red-500/10 text-red-500",
  Medium: "bg-amber-500/10 text-amber-500",
  Low: "bg-blue-500/10 text-blue-500",
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = MOCK_LEADS.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Leads</h1>
          <p className="text-muted-foreground">Manage and track your sales opportunities.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" /> Add Lead
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 bg-card/50 border-border focus-visible:ring-primary" 
            placeholder="Filter leads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" /> Filters
        </Button>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="w-4 h-4" /> Sort
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card/30 overflow-hidden"
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-semibold text-foreground">Lead Name</TableHead>
              <TableHead className="font-semibold text-foreground">Company</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Priority</TableHead>
              <TableHead className="font-semibold text-foreground">Source</TableHead>
              <TableHead className="font-semibold text-foreground">Assigned To</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-muted/10 transition-colors group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold group-hover:text-primary transition-colors">{lead.name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {lead.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[lead.status]}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={priorityColors[lead.priority]}>
                    {lead.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{lead.source}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {lead.assignedTo.charAt(0)}
                    </div>
                    <span className="text-sm">{lead.assignedTo}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/leads/${lead.id}`}>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Lead</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredLeads.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No leads found matching your search.
          </div>
        )}
      </motion.div>
    </div>
  );
}
