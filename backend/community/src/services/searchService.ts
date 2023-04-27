import config from '@/config';
import algoliasearch, { SearchIndex } from 'algoliasearch';
import { Inject, Service } from 'typedi';
import { IPost } from '@/interfaces/IPost';
import { consumer } from '@/loaders/kafka';
import { Consumer } from 'kafkajs';
import { Logger } from 'winston';
import { IKafkaSearchTopic, KafkaSearchTopic } from '@/interfaces/IKafka';
import { IComment } from '@/interfaces/IComment';
import { ICommunity } from '@/interfaces/ICommunity';

@Service()
export class SearchService {
  protected client = algoliasearch(config.search.algolia_application_id, config.search.algolia_admin_api_key);
  protected postsIndex: SearchIndex;
  protected commentsIndex: SearchIndex;
  protected communitiesIndex: SearchIndex;
  protected consumerInstance: Consumer;
  protected logger: Logger;

  constructor(@Inject('logger') logger: Logger) {
    this.postsIndex = this.client.initIndex(config.search.postsIndex);
    this.commentsIndex = this.client.initIndex(config.search.commentsIndex);
    this.communitiesIndex = this.client.initIndex(config.search.communitiesIndex);
    this.consumerInstance = consumer;
    this.logger = logger;

    this.initializeConsumer();
  }

  /**
   * The searchable attributes are configured from the Algolia's Dashboard
   */

  public initializeConsumer = async () => {
    await this.consumerInstance.connect();
    await this.consumerInstance.subscribe({ topic: config.kafka.search_index_topic });
    await consumer.run({
      eachMessage: async ({ topic, message, partition }) => {
        const key = message.key.toString() as IKafkaSearchTopic;
        this.logger.debug(`Recieved message with key ${key}`);
        switch (key) {
          case KafkaSearchTopic.INDEX_NEW_COMMUNITY:
            await this.createCommunity(JSON.parse(message.value.toString()));
            break;
          case KafkaSearchTopic.INDEX_NEW_POST:
            await this.createPost(JSON.parse(message.value.toString()));
            break;
          case KafkaSearchTopic.INDEX_UPDATE_POST:
            const post = JSON.parse(message.value.toString());
            await this.updatePost(post);
            break;
          case KafkaSearchTopic.INDEX_DELETE_POST:
            const postId = message.value.toString();
            await this.deletePost(postId);
            break;
          case KafkaSearchTopic.INDEX_NEW_COMMENT:
            await this.indexComment(JSON.parse(message.value.toString()));
            break;
          case KafkaSearchTopic.INDEX_UPDATE_COMMENT:
            await this.updateComment(JSON.parse(message.value.toString()));
            break;
          case KafkaSearchTopic.INDEX_DELETE_COMMENT:
            await this.deleteComment(message.value.toString());
            break;
        }
      },
    });
  };

  private createCommunity = async (community: ICommunity) => {
    const { objectID } = await this.communitiesIndex.saveObject(community, { autoGenerateObjectIDIfNotExist: true });
    this.logger.debug(`Indexed community with communityId ${community._id} and algoliaObjectId ${objectID}`);
    return objectID;
  };

  private createPost = async (post: IPost) => {
    post = { ...post };
    post.dislikedBy = undefined;
    post.likedBy = undefined;
    post['__v'] = undefined;
    const { objectID } = await this.postsIndex.saveObject(post, { autoGenerateObjectIDIfNotExist: true });
    this.logger.debug(`Indexed post with postId ${post._id} and algoliaObjectId ${objectID}`);
    return objectID;
  };

  private deletePost = async pId => {
    try {
      const existing = await this.postsIndex.findObject(hit => hit['_id'] == pId);
      const objectID = existing.object.objectID;
      await this.postsIndex.deleteObject(objectID);
      return objectID;
    } catch (error) {
      this.logger.error(`PostId ${pId} could not be deleted from algolia`);
    }
  };

  private updatePost = async (post: IPost) => {
    try {
      const existing = await this.postsIndex.findObject(hit => hit['_id'] == post._id);
      const objectID = existing.object.objectID;
      await this.postsIndex.partialUpdateObject({ objectID, ...post });
      return objectID;
    } catch (error) {
      this.logger.error(`Postid ${post._id} could not be updated on algolia`);
    }
  };

  private indexComment = async (comment: IComment) => {
    comment = { ...comment };
    comment.isEdited = undefined;
    comment.likedBy = undefined;
    comment.dislikedBy = undefined;
    comment.children = undefined;
    comment['__v'] = undefined;

    const { objectID } = await this.commentsIndex.saveObject(comment, { autoGenerateObjectIDIfNotExist: true });
    this.logger.debug(`Indexed comment with commentId ${comment._id} and algoliaObjectId ${objectID}`);

    return objectID;
  };

  private updateComment = async (comment: IComment) => {
    try {
      const existing = await this.commentsIndex.findObject(hit => hit['_id'] == comment._id);
      const objectID = existing.object.objectID;
      await this.commentsIndex.partialUpdateObject({ objectID, ...comment });
      return objectID;
    } catch (error) {
      this.logger.error(`CommentId ${comment._id} could not be updated on algolia`);
    }
  };

  private deleteComment = async commentId => {
    try {
      const existing = await this.commentsIndex.findObject(hit => hit['_id'] == commentId);
      const objectID = existing.object.objectID;
      await this.commentsIndex.deleteObject(objectID);
      return objectID;
    } catch (error) {
      this.logger.error(`CommentID ${commentId} could not be deleted from algolia`);
    }
  };
}
