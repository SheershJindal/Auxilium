import config from '@/config';
import { IComment, ICommentCreateInputDTO } from '@/interfaces/IComment';
import { KafkaSearchTopic } from '@/interfaces/IKafka';
import { IAnnouncementInputDTO, IPost, IPostInputDTO, IPostMinInputDTO } from '@/interfaces/IPost';
import { producer } from '@/loaders/kafka';
import { CommentRepository } from '@/repositories/commentRepository';
import { PostRepository } from '@/repositories/postRepository';
import { UserCommunityRepository } from '@/repositories/userCommunityRepository';
import { Producer } from 'kafkajs';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export class PostService {
  protected postRepositoryInstance: PostRepository;
  protected commentRepositoryInstance: CommentRepository;
  protected userCommunityRepositoryInstance: UserCommunityRepository;
  protected producerInstance: Producer;

  constructor(
    postRepository: PostRepository,
    commentRepository: CommentRepository,
    userCommunityRepository: UserCommunityRepository,
    @Inject('logger') private logger: Logger,
  ) {
    this.postRepositoryInstance = postRepository;
    this.commentRepositoryInstance = commentRepository;
    this.userCommunityRepositoryInstance = userCommunityRepository;
    this.producerInstance = producer;
  }

  public createPost = async (postInputDTO: IPostMinInputDTO): Promise<IPost> => {
    try {
      this.logger.silly('Creating post record');

      const checkExistence = await this.userCommunityRepositoryInstance.getUserCommunity(
        postInputDTO.userId,
        postInputDTO.communityId,
      );
      if (!checkExistence) throw 'You must be subscribed to the community in order to create a new post.';

      const postRecord = await this.postRepositoryInstance.createPost({
        ...postInputDTO,
        type: 'General',
      });
      if (!postRecord) throw 'Post cannot be created';
      const post = { ...postRecord };

      await this.pushPostForCreatingIndex(post);

      Reflect.deleteProperty(post, 'createdAt');
      Reflect.deleteProperty(post, 'updatedAt');

      return post;
    } catch (e) {
      throw e;
    }
  };

  public officerCreatesAnnouncement = async (announcementInputDTO: IAnnouncementInputDTO) => {
    try {
      this.logger.silly('Creating post record');

      const postRecord = await this.postRepositoryInstance.createPost({ ...announcementInputDTO, type: 'Announcement' });
      if (!postRecord) throw 'Announcement cannot be created';
      const post = { ...postRecord };

      await this.pushPostForCreatingIndex(post);

      delete post.createdAt;
      delete post.updatedAt;

      return post;
    } catch (e) {
      throw e;
    }
  };

  /**
   * Allows deletion of post from user who created the post or
   * the moderator of the community for which the post belongs to
   */
  public deletePost = async (userId: IPost['userId'], postId: IPost['_id']) => {
    try {
      const postRecord = await this.postRepositoryInstance.getPostByIdWithModerator(postId);
      if (!postRecord) throw 'The post does not exist';

      const moderators = postRecord.moderators.map(moderator => moderator.toString());

      if (postRecord['userId'].toString() == userId.toString() || moderators.includes(userId.toString())) {
        this.logger.silly('Soft deleting post record');

        const newRecord = await this.postRepositoryInstance.softDeletePost(postId);
        await this.pushPostForDeletingIndex(postId);
        return { id: newRecord.insertedId };
      }
      throw 'You are not authorized to delete this post.';
    } catch (error) {
      throw error;
    }
  };

  public getPost = async (userId, postId) => {
    const postRecord = await this.postRepositoryInstance.getPostByIdAggregated(postId);
    if (!postRecord) throw 'The post does not exist.';
    const commentsRecord = await this.commentRepositoryInstance.getCommentsForPost(postId);
    const postObj = {};
    postObj['_id'] = postRecord._id;
    postObj['likes'] = postRecord.likes;
    postObj['dislikes'] = postRecord.dislikes;
    postObj['createdAt'] = postRecord.createdAt;
    postObj['username'] = postRecord['username'];

    let likedByMe = false;
    let dislikedByMe = false;

    for (let likedID of postRecord['likedBy']) {
      if (userId == likedID) {
        likedByMe = true;
        break;
      }
    }

    if (!likedByMe)
      for (let dislikedID of postRecord['dislikedBy']) {
        if (userId == dislikedID) {
          dislikedByMe = true;
          break;
        }
      }
    postObj['likedByMe'] = likedByMe;
    postObj['dislikedByMe'] = dislikedByMe;

    postObj['content'] = postRecord.data.content;
    postObj['imageURI'] = postRecord.data['imageURI'] || null;
    postObj['videoURI'] = postRecord.data['videoURI'] || null;

    const commentsTree = this.buildCommentsTree(commentsRecord, userId);

    return { post: postObj, comments: commentsTree };
  };

  public likeUnlikePost = async (userId: IPost['userId'], postId: IPost['_id']) => {
    try {
      this.logger.silly('Updating post record');

      const postRecord = await this.postRepositoryInstance.likeUnlikePost(userId, postId);
      let post = { ...postRecord };
      await this.pushPostForUpdatingIndex(post);

      let likedBy = [];
      let dislikedBy = [];
      post.dislikedBy.map(id => dislikedBy.push(id.toString()));
      post.likedBy.map(id => likedBy.push(id.toString()));
      post['likedByMe'] = false;
      post['dislikedByMe'] = false;

      if (likedBy.includes(userId.toString())) {
        post['likedByMe'] = true;
      }
      if (dislikedBy.includes(userId.toString())) {
        post['dislikedByMe'] = true;
      }
      delete post.likedBy;
      delete post.dislikedBy;

      Reflect.deleteProperty(post, 'createdAt');
      Reflect.deleteProperty(post, 'updatedAt');
      Reflect.deleteProperty(post, '__v');

      return post;
    } catch (e) {
      throw e;
    }
  };

  public dislikeUndislikePost = async (userId: IPost['userId'], postId: IPost['_id']) => {
    try {
      this.logger.silly('Updating post record');

      const postRecord = await this.postRepositoryInstance.dislikeUndislikePost(userId, postId);

      let post = { ...postRecord };
      await this.pushPostForUpdatingIndex(post);

      let likedBy = [];
      let dislikedBy = [];
      post.dislikedBy.map(id => dislikedBy.push(id.toString()));
      post.likedBy.map(id => likedBy.push(id.toString()));
      post['likedByMe'] = false;
      post['dislikedByMe'] = false;

      if (likedBy.includes(userId.toString())) {
        post['likedByMe'] = true;
      }
      if (dislikedBy.includes(userId.toString())) {
        post['dislikedByMe'] = true;
      }
      delete post.likedBy;
      delete post.dislikedBy;

      Reflect.deleteProperty(post, 'createdAt');
      Reflect.deleteProperty(post, 'updatedAt');
      Reflect.deleteProperty(post, '__v');

      return post;
    } catch (e) {
      throw e;
    }
  };

  public createComment = async (commentInputDTO: ICommentCreateInputDTO) => {
    try {
      this.logger.silly('Creating comment record');

      const checkExistence = await this.postRepositoryInstance.getPostByIdAggregated(commentInputDTO.postId);
      if (!checkExistence) throw 'The post does not exist';

      const commentRecord = await this.commentRepositoryInstance.createComment({ ...commentInputDTO });
      if (commentInputDTO.parentId) {
        await this.commentRepositoryInstance.linkCommentToParent(commentRecord._id, commentInputDTO.parentId);
      }
      if (!commentRecord) throw 'Comment cannot be created';
      const comment = { ...commentRecord };

      await this.pushCommentForCreatingIndex(comment);

      Reflect.deleteProperty(comment, 'createdAt');
      Reflect.deleteProperty(comment, 'updatedAt');

      return comment;
    } catch (e) {
      throw e;
    }
  };

  public deleteComment = async (userId: IComment['userId'], commentId: IComment['_id']) => {
    try {
      const commentRecord = await this.commentRepositoryInstance.getCommentByIdWithModerator(commentId);
      if (!commentRecord) throw 'The comment does not exist';

      const moderators = commentRecord.moderators.map(moderator => moderator.toString());

      if (commentRecord.userId.toString() == userId.toString() || moderators.includes(userId.toString())) {
        this.logger.silly('Soft deleting comment record');

        const newRecord = await this.commentRepositoryInstance.softDeleteComment(commentId);
        await this.pushCommentForDeletingIndex(commentId);

        return { id: newRecord.insertedId };
      }
      throw 'You are not authorized to delete this comment.';
    } catch (error) {
      throw error;
    }
  };

  public likeUnlikeComment = async (userId: IComment['userId'], commentId: IComment['_id']) => {
    try {
      this.logger.silly('Updating comment record');

      const commentRecord = await this.commentRepositoryInstance.likeUnlikeComment(userId, commentId);
      let comment = { ...commentRecord };

      await this.pushCommentForUpdatingIndex(comment);

      let likedBy = [];
      let dislikedBy = [];
      comment.dislikedBy.map(id => dislikedBy.push(id.toString()));
      comment.likedBy.map(id => likedBy.push(id.toString()));
      comment['likedByMe'] = false;
      comment['dislikedByMe'] = false;

      if (likedBy.includes(userId.toString())) {
        comment['likedByMe'] = true;
      }
      if (dislikedBy.includes(userId.toString())) {
        comment['dislikedByMe'] = true;
      }
      delete comment.likedBy;
      delete comment.dislikedBy;

      Reflect.deleteProperty(comment, 'createdAt');
      Reflect.deleteProperty(comment, 'updatedAt');
      Reflect.deleteProperty(comment, '__v');

      return comment;
    } catch (e) {
      throw e;
    }
  };

  public dislikeUndislikeComment = async (userId: IComment['userId'], commentId: IComment['_id']) => {
    try {
      this.logger.silly('Updating comment record');

      const commentRecord = await this.commentRepositoryInstance.dislikeUndislikeComment(userId, commentId);
      let comment = { ...commentRecord };

      await this.pushCommentForUpdatingIndex(comment);

      let likedBy = [];
      let dislikedBy = [];
      comment.dislikedBy.map(id => dislikedBy.push(id.toString()));
      comment.likedBy.map(id => likedBy.push(id.toString()));
      comment['likedByMe'] = false;
      comment['dislikedByMe'] = false;

      if (likedBy.includes(userId.toString())) {
        comment['likedByMe'] = true;
      }
      if (dislikedBy.includes(userId.toString())) {
        comment['dislikedByMe'] = true;
      }
      delete comment.likedBy;
      delete comment.dislikedBy;

      Reflect.deleteProperty(comment, 'createdAt');
      Reflect.deleteProperty(comment, 'updatedAt');
      Reflect.deleteProperty(comment, '__v');

      return comment;
    } catch (e) {
      throw e;
    }
  };

  private buildCommentsTree = (comments: IComment[], userId) => {
    const map = {};

    comments.map(comment => {
      map[comment['_id'].toString()] = comment;
    });

    const recursiveBuild = (segregatedCommentIds: IComment['_id'][]) => {
      let arr = [];
      for (let commentId of segregatedCommentIds) {
        let comment = { ...map[commentId.toString()] };
        if (!comment['_id']) break;

        if (comment['children'] && comment['children'].length > 0) {
          let childrenIds = comment['children'];
          const childrenComments = recursiveBuild(childrenIds);
          comment['children'] = childrenComments;
        }

        let dislikedByMe = false;
        let likedByMe = false;

        for (let dislikedById of comment['dislikedBy']) {
          if (userId == dislikedById) {
            dislikedByMe = true;
            break;
          }
        }
        if (!dislikedByMe)
          for (let likedById of comment['likedBy']) {
            if (userId == likedById) {
              likedByMe = true;
              break;
            }
          }
        delete comment.dislikedBy;
        delete comment.likedBy;
        delete comment.__v;

        comment['likedByMe'] = likedByMe;
        comment['dislikedByMe'] = dislikedByMe;
        comment['profilePhotoURI'] = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        arr.push(comment);
      }
      arr.sort((a, b) => b.createdAt - a.createdAt);
      return arr;
    };

    let rootLevelIDs = [];
    comments.map(comment => {
      if (!comment.parentId) {
        rootLevelIDs.push(comment._id);
      }
    });
    const arr = recursiveBuild(rootLevelIDs);
    return arr;
  };

  private pushPostForCreatingIndex = async (post: IPost) => {
    return await this.producerInstance.send({
      topic: config.kafka.search_index_topic,
      messages: [{ value: JSON.stringify(post), key: KafkaSearchTopic.INDEX_NEW_POST }],
    });
  };

  private pushPostForUpdatingIndex = async (post: IPost) => {
    return await this.producerInstance.send({
      topic: config.kafka.search_index_topic,
      messages: [{ value: JSON.stringify(post), key: KafkaSearchTopic.INDEX_UPDATE_POST }],
    });
  };

  private pushPostForDeletingIndex = async (postId: IPost['_id']) => {
    return await this.producerInstance.send({
      topic: config.kafka.search_index_topic,
      messages: [{ value: postId.toString(), key: KafkaSearchTopic.INDEX_DELETE_POST }],
    });
  };

  private pushCommentForCreatingIndex = async (comment: IComment) => {
    return await this.producerInstance.send({
      topic: config.kafka.search_index_topic,
      messages: [{ value: JSON.stringify(comment), key: KafkaSearchTopic.INDEX_NEW_COMMENT }],
    });
  };

  private pushCommentForUpdatingIndex = async (comment: IComment) => {
    return await this.producerInstance.send({
      topic: config.kafka.search_index_topic,
      messages: [{ value: JSON.stringify(comment), key: KafkaSearchTopic.INDEX_UPDATE_COMMENT }],
    });
  };

  private pushCommentForDeletingIndex = async (commentId: IComment['_id']) => {
    return await this.producerInstance.send({
      topic: config.kafka.search_index_topic,
      messages: [{ value: commentId.toString(), key: KafkaSearchTopic.INDEX_DELETE_COMMENT }],
    });
  };
}
