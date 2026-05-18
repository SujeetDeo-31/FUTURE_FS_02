export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted' | 'Lost';
export type LeadPriority = 'Low' | 'Medium' | 'High';

export interface LeadNote {
  _id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Lead {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  notes: LeadNote[];
}
