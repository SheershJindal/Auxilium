import { TagRepository } from '@/repositories/tagRepository';
import { scheduleJob } from 'node-schedule';
import { Service } from 'typedi';

@Service()
export default class TagJob {
  protected tagRepositoryInstance: TagRepository;
  constructor(tagRepository: TagRepository) {
    this.tagRepositoryInstance = tagRepository;
  }

  /**Every Hour */
  reinitializeCache = scheduleJob('0 0 * ? * *', () => {
    this.tagRepositoryInstance.reinitializeCache();
  });
}
