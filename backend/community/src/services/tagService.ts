import { ITag } from '@/interfaces/ITag';
import { TagRepository } from '@/repositories/tagRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export class TagService {
  protected tagRepositoryInstance: TagRepository;
  protected logger: Logger;

  constructor(tagRepository: TagRepository, @Inject('logger') logger: Logger) {
    this.tagRepositoryInstance = tagRepository;
    this.logger = logger;
  }

  public createTag = async (tag: ITag['tag']): Promise<ITag['tag']> => {
    const existing = this.tagRepositoryInstance.checkExistingTagInCache(tag);
    if (existing) return tag;

    const tagRecord = await this.tagRepositoryInstance.createTag(tag);
    this.tagRepositoryInstance.addTagInCache({ _id: tagRecord._id, tag: tagRecord.tag });
    return tagRecord.tag;
  };

  public getAllTags = async () => {
    const cache = this.tagRepositoryInstance.getTagsFromCache();
    return cache;
  };
}
