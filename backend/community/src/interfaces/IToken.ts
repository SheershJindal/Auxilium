import { Types } from 'mongoose';

export interface IToken {
  userId: Types.ObjectId;
  username: String;
  role: String;
  iat: Number;
  exp: Number;
}
