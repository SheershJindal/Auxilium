import { IUser } from '@/interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      required: true,
    },
    username: {
      type: String,
      index: true,
      required: true,
    },

    password: String,

    salt: String,

    role: {
      type: String,
      enum: ['user'],
      default: 'user',
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
