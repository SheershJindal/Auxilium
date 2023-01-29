import { IComment, ICommentCreateInputDTO } from '@/interfaces/IComment';
import { IPostInputDTO } from '@/interfaces/IPost';
import { CommentRepository } from '@/repositories/commentRepository';
import { PostRepository } from '@/repositories/postRepository';
import { UserCommunityRepository } from '@/repositories/userCommunityRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export class PostService {
  protected postRepositoryInstance: PostRepository;
  protected commentRepositoryInstance: CommentRepository;
  protected userCommunityRepositoryInstance: UserCommunityRepository;

  constructor(
    postRepository: PostRepository,
    commentRepository: CommentRepository,
    userCommunityRepository: UserCommunityRepository,
    @Inject('logger') private logger: Logger,
  ) {
    this.postRepositoryInstance = postRepository;
    this.commentRepositoryInstance = commentRepository;
    this.userCommunityRepositoryInstance = userCommunityRepository;
  }

  public createPost = async (postInputDTO: IPostInputDTO) => {
    try {
      this.logger.silly('Creating post record');

      const checkExistence = await this.userCommunityRepositoryInstance.getUserCommunity(
        postInputDTO.userId,
        postInputDTO.communityId,
      );
      if (!checkExistence) throw 'You must be subscribed to the community in order to create a new post.';

      const postRecord = await this.postRepositoryInstance.createPost({
        ...postInputDTO,
        type: postInputDTO['type'] || 'General',
      });
      if (!postRecord) throw 'Post cannot be created';
      const post = { ...postRecord };
      Reflect.deleteProperty(post, 'createdAt');
      Reflect.deleteProperty(post, 'updatedAt');

      return post;
    } catch (e) {
      throw e;
    }
  };

  public getPost = async (userId, postId) => {
    const postRecord = await this.postRepositoryInstance.getPostById(postId);
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

  public createComment = async (commentInputDTO: ICommentCreateInputDTO) => {
    try {
      this.logger.silly('Creating comment record');

      const checkExistence = await this.postRepositoryInstance.getPostById(commentInputDTO.postId);
      if (!checkExistence) throw 'The post does not exist';

      const commentRecord = await this.commentRepositoryInstance.createComment({ ...commentInputDTO });
      if (commentInputDTO.parentId) {
        await this.commentRepositoryInstance.linkCommentToParent(commentRecord._id, commentInputDTO.parentId);
      }
      if (!commentRecord) throw 'Comment cannot be created';
      const comment = { ...commentRecord };

      Reflect.deleteProperty(comment, 'createdAt');
      Reflect.deleteProperty(comment, 'updatedAt');

      return comment;
    } catch (e) {
      throw e;
    }
  };

  public likeUnlikeComment = async (userId: IComment['userId'], commentId: IComment['_id']) => {
    try {
      this.logger.silly('Updating comment record');

      const commentRecord = await this.commentRepositoryInstance.likeUnlikeComment(userId, commentId);
      let comment = { ...commentRecord };

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

  private recursiveBuild = () => {};
}