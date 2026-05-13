import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  leadId: mongoose.Types.ObjectId;
  content: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
  content: { type: String, required: true },
  authorName: { type: String, required: true },
}, { 
  timestamps: true 
});

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;