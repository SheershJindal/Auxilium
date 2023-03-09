import { ITag } from '@/interfaces/ITag';
import mongoose from 'mongoose';

const Tag = new mongoose.Schema(
  {
    tag: {
      required: true,
      type: String,
      index: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITag & mongoose.Document>('Tag', Tag);
