import { SearchService } from '@/services/searchService';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

@Service()
export class SearchController {
  protected searchServiceInstance: SearchService;
  protected logger: Logger;

  constructor(searchService: SearchService, @Inject('logger') logger) {
    this.searchServiceInstance = searchService;
    this.logger = logger;
  }

  public searchTerm = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling Search Ternm endpoint with %o', { query: req.query, params: req.params });

    try {
      const term = req.query.term;
      const results = await this.searchServiceInstance.search(term);

      return res.status(200).json(Result.success(results));
    } catch (error) {
      return next(error);
    }
  };
}
