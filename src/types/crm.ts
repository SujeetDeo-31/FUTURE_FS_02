export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted' | 'Lost';
export type LeadPriority = 'Low' | 'Medium' | 'High';

export interface Note {
  id: string;
  _id?: string;
  content: string;
  timestamp: string;
  createdAt?: string;
  authorName: string;
}

export interface StatusChange {
  timestamp: string;
  oldStatus: string;
  newStatus: string;
}

export interface Lead {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo: string;
  notes: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  notesHistory?: Note[]; // Still compatible with old UI
  statusHistory?: StatusChange[]; // Still compatible with old UI
}

export interface Activity {
  id: string;
  _id?: string;
  type: 'note' | 'status' | 'lead' | 'followup';
  leadName: string;
  content: string;
  timestamp: string;
  createdAt?: string;
}

export interface CRMStats {
  totalLeads: number;
  convertedCount: number;
  newLeadsCount: number;
  followUpsDueCount: number;
  statusBreakdown: Record<LeadStatus, number>;
  sourceBreakdown: Record<string, number>;
  sourceData?: { name: string; value: number }[];
  growthData?: { month: string; leads: number; active: number }[];
  conversionRate?: number;
}