import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  bio: string;
  aiCredits: number;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  bio: { type: String },
  aiCredits: { type: Number, default: 500 },
}, { 
  timestamps: true 
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
