import { ITag } from '@/interfaces/ITag';
import { TagRepository } from '@/repositories/tagRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export class TagService {
  protected tagRepositoryInstance: TagRepository;
  protected logger: Logger;

  constructor(tagRepository: TagRepository, @Inject('logger') logger) {
    this.tagRepositoryInstance = tagRepository;
    this.logger = logger;
  }

  public createTag = async (tag: ITag['tag']) => {
    const tagRecord = await this.tagRepositoryInstance.createTag(tag);
    await this.tagRepositoryInstance.addTagInCache({ _id: tagRecord._id, tag: tagRecord.tag });
    return { _id: tagRecord._id, tag: tagRecord.tag };
  };

  public getAllTags = async () => {
    const cache = await this.tagRepositoryInstance.getTagsFromCache();
    if (cache && cache.length > 0) {
      /**@todo remove later */
      this.logger.debug('Serving supersonic from cache 🔥🔥');
      return JSON.parse(cache);
    }
    /**@todo remove later */
    this.logger.debug('Serving slowly from db 😢😢');
    const records = await this.tagRepositoryInstance.getTagsFromDB();
    this.logger.debug('Caching the tags 🚀');
    this.tagRepositoryInstance.populateTagsInCache(records);
    return records;
  };
}
