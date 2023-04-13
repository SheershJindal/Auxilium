import { IAnnouncementInputDTO } from '@/interfaces/IAnnouncement';
import AnnouncementService from '@/services/announcementService';
import { Inject } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

export class AnnouncementController {
  protected announcementServiceInstance: AnnouncementService;
  constructor(announcementService: AnnouncementService, @Inject('logger') private logger: Logger) {
    this.announcementServiceInstance = announcementService;
  }

  public createAnnouncement = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling Create Announcement endpoint with body: %o', req.body);

    try {
      const officerId = req.currentUser.userId as IAnnouncementInputDTO['officerId'];
      const title = req.body.title as IAnnouncementInputDTO['title'];
      const subtitle = req.body.subtitle as IAnnouncementInputDTO['subtitle'];
      const deadline = req.body.deadline as IAnnouncementInputDTO['deadline'];
      const url = req.body.url as IAnnouncementInputDTO['url'];
      const content = req.body.content as IAnnouncementInputDTO['content'];
      const announcement = await this.announcementServiceInstance.createAnnouncement({
        content,
        deadline,
        officerId,
        title,
        url,
        subtitle,
      });
      return res.status(200).json(Result.success(announcement));
    } catch (error) {
      return next(error);
    }
  };
}
