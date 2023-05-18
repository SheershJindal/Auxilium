import { DiscoverService } from '@/services/discoverService';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';
import { Service } from 'typedi';

@Service()
export class DiscoverController {
  protected discoverServiceInstance: DiscoverService;
  constructor(discoverService: DiscoverService) {
    this.discoverServiceInstance = discoverService;
  }

  public getCustomisedDiscover = async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const userId = req.currentUser.userId;
      const posts = await this.discoverServiceInstance.getCustomisedDiscover(userId);
      return res.status(200).json(Result.success(posts));
    } catch (error) {
      return next(error);
    }
  };
}
