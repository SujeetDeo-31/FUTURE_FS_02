import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  type: 'note' | 'status' | 'lead' | 'followup';
  leadId: mongoose.Types.ObjectId;
  leadName: string;
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema({
  type: { 
    type: String, 
    enum: ['note', 'status', 'lead', 'followup'], 
    required: true 
  },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
  leadName: { type: String, required: true },
  content: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;