import { IAnnouncementInputDTO } from '@/interfaces/IAnnouncement';
import { AnnouncementRepository } from '@/repositories/announcementRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export default class AnnouncementService {
  protected announcementRepositoryInstance: AnnouncementRepository;
  constructor(announcementRepository: AnnouncementRepository, @Inject('logger') private logger: Logger) {
    this.announcementRepositoryInstance = announcementRepository;
  }

  public createAnnouncement = async (announcementInputDTO: IAnnouncementInputDTO) => {
    try {
      const announcementRecord = await this.announcementRepositoryInstance.createAnnouncement(announcementInputDTO);
      this.logger.silly('Creating announcement db record');

      const announcement = { ...announcementRecord };
      delete announcement.updatedAt;
      delete announcement.createdAt;

      return announcement;
    } catch (error) {
      throw error;
    }
  };
}
