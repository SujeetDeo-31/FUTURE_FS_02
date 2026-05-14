import mongoose, { Schema, Document, Model } from 'mongoose';
import { LeadStatus, LeadPriority } from '@/types/crm';

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo: string;
  notes: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String },
  company: { type: String },
  source: { type: String, default: 'Website' },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'],
    default: 'New',
    index: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium' 
  },
  assignedTo: { type: String, default: 'Unassigned' },
  notes: { type: String },
  followUpDate: { type: Date },
}, { 
  timestamps: true 
});

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
