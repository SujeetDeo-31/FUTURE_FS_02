
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  bio: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  bio: { type: String },
}, { 
  timestamps: true 
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
