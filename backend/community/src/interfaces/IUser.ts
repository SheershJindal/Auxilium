import { Types } from 'mongoose';
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  role: 'user';
  password: string;
  salt: string;
  isBanned: boolean;
}

export interface IUserInputDTO {
  email: IUser['email'];
  username: IUser['username'];
  password: IUser['password'];
}
