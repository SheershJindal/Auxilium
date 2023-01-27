import { Types } from 'mongoose';

export interface ICommunity {
  _id: Types.ObjectId;
  name: String;
  totalMembers: number;
  isClosed?: Boolean;
  moderators: Types.ObjectId[];
}

export interface ICommunityInputDTO {
  name: ICommunity['name'];
  moderatorId: ICommunity['moderators'][0];
}
