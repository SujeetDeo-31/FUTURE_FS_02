import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
  title: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  statsSnapshot: {
    totalLeads: number;
    conversionRate: number;
    activeLeads: number;
  };
  createdAt: Date;
}

const ReportSchema: Schema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  insights: [{ type: String }],
  recommendations: [{ type: String }],
  statsSnapshot: {
    totalLeads: { type: Number },
    conversionRate: { type: Number },
    activeLeads: { type: Number },
  },
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;