import Container, { Inject, Service } from 'typedi';
import TagModel from '@/models/tag';
import * as enums from '@/constants/enums';
import { ITag } from '@/interfaces/ITag';
import { Logger } from 'winston';
import { Redis } from 'ioredis';

@Service()
export class TagRepository {
  protected logger: Logger;
  protected cacheInstance: Redis;

  constructor(@Inject('logger') logger: Logger) {
    this.logger = logger;
    this.cacheInstance = Container.get('cache');
  }

  /**
   * @todo
   * ⚠️⚠️⚠️There can be an issue of cache inconsistencies, currently handling by resetting it every 1 hour, still not a permanent solution 😢
   */

  public createTag = async (tag: String) => {
    const tagRecord = (await TagModel.create({ tag })).toObject();
    if (!tagRecord) throw 'Tag cannot be created';

    return tagRecord;
  };

  public addTagInCache = async ({ _id, tag }: { _id: ITag['_id']; tag: ITag['tag'] }) => {
    const result = await this.cacheInstance.hset(enums.Constants.CACHE_TAGS, _id.toString(), tag);
    return result == 1;
  };

  public populateTagsInCache = async (tags: { _id: ITag['_id']; tag: ITag['tag'] }[]) => {
    const obj = {};
    for (const record of tags) {
      obj[record._id.toString()] = record.tag;
    }
    await this.cacheInstance.hmset(enums.Constants.CACHE_TAGS, obj);
    return tags;
  };

  public getTagsFromDB = async () => {
    const records = await TagModel.find().lean();
    const results = this.resultify(records);
    return results;
  };

  public getTagsFromCache = async () => {
    const cache = await this.cacheInstance.hgetall(enums.Constants.CACHE_TAGS);
    const arr = [];
    for (const record in cache) {
      const obj = {};
      obj['_id'] = record;
      obj['tag'] = cache[record];
      arr.push(obj);
    }

    return arr;
  };

  public reinitializeCache = async () => {
    /**
     * @todo
     * Best way should be to use transactions while creating tags, so that we maintain consistency between cache and db. Probably will leave that for some later time :)
     */
    const records = await TagModel.find().lean();
    const results = this.resultify(records);
    const obj = {};
    for (const record of results) {
      obj[record._id.toString()] = record.tag;
    }
    const status = await this.cacheInstance.hmset(enums.Constants.CACHE_TAGS, obj);
    return status;
  };

  private resultify = (records: ITag[]) => {
    const results = records.map(record => {
      return { _id: record._id, tag: record.tag };
    });
    return results;
  };
}
