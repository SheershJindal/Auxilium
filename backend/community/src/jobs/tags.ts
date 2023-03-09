import { TagRepository } from '@/repositories/tagRepository';
import { scheduleJob } from 'node-schedule';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export default class TagJob {
  protected tagRepositoryInstance: TagRepository;
  protected loggerInstance: Logger;
  constructor(tagRepository: TagRepository, @Inject('logger') logger: Logger) {
    this.tagRepositoryInstance = tagRepository;
    this.loggerInstance = logger;
  }

  /**Every Hour */
  reinitializeCache = scheduleJob('0 0 * ? * *', () => {
    this.loggerInstance.debug('Automated job for re-initializing cache...');
    this.tagRepositoryInstance.reinitializeCache();
  });
}
