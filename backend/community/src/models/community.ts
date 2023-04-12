import { ICommunity } from '@/interfaces/ICommunity';
import mongoose, { Types } from 'mongoose';

const Community = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    totalMembers: {
      type: Number,
      default: 1,
    },
    imageURI: String,
    description: {
      type: String,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    moderators: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true },
);

export default mongoose.model<ICommunity & mongoose.Document>('Community', Community);
