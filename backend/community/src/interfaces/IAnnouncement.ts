import { Types } from 'mongoose';

export interface IAnnouncement {
  title: String;
  subtitle?: String;
  deadline: Date;
  url?: String;
  content: String;
  officerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnnouncementInputDTO {
  title: IAnnouncement['title'];
  subtitle?: IAnnouncement['subtitle'];
  deadline: IAnnouncement['deadline'];
  url: IAnnouncement['url'];
  content: IAnnouncement['content'];
  officerId: IAnnouncement['officerId'];
}
