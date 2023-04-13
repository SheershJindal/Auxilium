import { IAnnouncement, IAnnouncementInputDTO } from '@/interfaces/IAnnouncement';
import { Service } from 'typedi';
import AnnouncementModel from '@/models/announcement';

@Service()
export class AnnouncementRepository {
  public createAnnouncement = async (announcementInputDTO: IAnnouncementInputDTO): Promise<IAnnouncement> => {
    const announcement = await AnnouncementModel.create({
      ...announcementInputDTO,
    });
    if (announcement) return announcement.toObject();
    return null;
  };
}
