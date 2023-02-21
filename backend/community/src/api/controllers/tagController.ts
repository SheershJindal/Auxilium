import { ITag } from '@/interfaces/ITag';
import { TagService } from '@/services/tagService';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

@Service()
export class TagController {
  protected tagServiceInstance: TagService;
  protected logger: Logger;

  constructor(tagService: TagService, @Inject('logger') logger: Logger) {
    this.tagServiceInstance = tagService;
    this.logger = logger;
  }

  public getAllTags = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling get all tags endpoint with query %o', req.query);

    try {
        
      const tags = await this.tagServiceInstance.getAllTags();
      return res.status(200).json(Result.success(tags));
    } catch (error) {
      return next(error);
    }
  };

  public createTag = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling create tag endpoint with body %o', req.body);

    try {
      const tag = req.body.tag as ITag['tag'];
      const tagResult = await this.tagServiceInstance.createTag(tag);
      return res.status(200).json(Result.success(tagResult));
    } catch (error) {
      return next(error);
    }
  };
}
