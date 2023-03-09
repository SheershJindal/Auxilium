import { Types } from 'mongoose';

export interface ITag {
  _id: Types.ObjectId;
  tag: String;
  createdAt: Date;
  updatedAt: Date;
}
