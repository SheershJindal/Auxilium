import { Types } from 'mongoose';

export interface ITag {
  _id: Types.ObjectId;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
}
