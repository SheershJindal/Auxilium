import Container, { Inject, Service } from 'typedi';
import TagModel from '@/models/tag';
import { ITag } from '@/interfaces/ITag';
import { Logger } from 'winston';
import NodeCache from 'node-cache';

@Service()
export class TagRepository {
  protected logger: Logger;
  protected cacheInstance: NodeCache;

  constructor(@Inject('logger') logger: Logger) {
    this.logger = logger;
    this.cacheInstance = Container.get('tagsCache');
  }

  public createTag = async (tag: String) => {
    try {
      const tagRecord = (await TagModel.create({ tag })).toObject();
      return tagRecord;
    } catch (error) {
      throw 'Tag cannot be created';
    }
  };

  public addTagInCache = ({ _id, tag }: { _id: ITag['_id']; tag: ITag['tag'] }) => {
    const status = this.cacheInstance.set(tag, _id);
    return status;
  };

  public checkExistingTagInCache = (tag: ITag['tag']) => {
    const tagRecord = this.cacheInstance.get(tag);
    return tagRecord;
  };

  public getTagsFromCache = () => {
    const tags = this.cacheInstance.keys();
    return tags;
  };

  public reinitializeCache = async () => {
    const records = await TagModel.find().lean();
    const results = this.resultify(records);

    const status = this.cacheInstance.mset(
      results.map(result => {
        return { key: result.tag, val: result._id };
      }),
    );
    return status;
  };

  private resultify = (records: ITag[]) => {
    const results = records.map(record => {
      return { _id: record._id, tag: record.tag };
    });
    return results;
  };
}
