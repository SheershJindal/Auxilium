import { IAnnouncement } from '@/interfaces/IAnnouncement';
import mongoose, { Types } from 'mongoose';

const Announcement = new mongoose.Schema(
  {
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IAnnouncement & mongoose.Document>('Announcement', Announcement);
