import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ILeadNote extends Document {
  content: string;
  author: string;
  createdAt: Date;
}

const LeadNoteSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted' | 'Lost';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  notes: Types.DocumentArray<ILeadNote>;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { 
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^[0-9+\-() ]*$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Letters are not allowed.`
    }
  },
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
  assignedTo: { type: String, default: 'Unassigned', index: true },
  notes: [LeadNoteSchema]
}, { 
  timestamps: true 
});

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
