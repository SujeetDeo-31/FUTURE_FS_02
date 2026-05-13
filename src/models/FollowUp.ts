import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFollowUp extends Document {
  leadId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FollowUpSchema: Schema = new Schema({
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
  scheduledDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String },
}, { 
  timestamps: true 
});

const FollowUp: Model<IFollowUp> = mongoose.models.FollowUp || mongoose.model<IFollowUp>('FollowUp', FollowUpSchema);

export default FollowUp;