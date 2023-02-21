import { Inject, Service } from 'typedi';
import TagModel from '@/models/tag';
import cacheStore from '@/loaders/cache';
import * as enums from '@/constants/enums';
import { ITag } from '@/interfaces/ITag';
import { Logger } from 'winston';

@Service()
export class TagRepository {
  protected logger: Logger;

  constructor(@Inject('logger') logger: Logger) {
    this.logger = logger;
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
    const prev = JSON.parse(await cacheStore.get(enums.Constants.CACHE_TAGS)) || [];
    const current = { _id, tag };
    const updated = JSON.stringify([...prev, current]);
    await cacheStore.set(enums.Constants.CACHE_TAGS, updated);
    return updated;
  };

  public populateTagsInCache = async (tags: { _id: ITag['_id']; tag: ITag['tag'] }[]) => {
    const value = JSON.stringify(tags);
    await cacheStore.set(enums.Constants.CACHE_TAGS, value);
    return tags;
  };

  public getTagsFromDB = async () => {
    const records = await TagModel.find().lean();
    const results = this.resultify(records);
    return results;
  };

  public getTagsFromCache = async () => {
    const cache = await cacheStore.get(enums.Constants.CACHE_TAGS);
    return cache;
  };

  public reinitializeCache = async () => {
    /**
     * @todo
     * Best way should be to use transactions while creating tags, so that we maintain consistency between cache and db. Probably will leave that for some later time :)
     */
    const records = await TagModel.find().lean();
    const results = this.resultify(records);
    await cacheStore.set(enums.Constants.CACHE_TAGS, JSON.stringify(results));
  };

  private resultify = (records: ITag[]) => {
    const results = records.map(record => {
      return { _id: record._id, tag: record.tag };
    });
    return results;
  };
}
