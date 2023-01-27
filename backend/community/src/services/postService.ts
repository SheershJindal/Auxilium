import { ICommentCreateInputDTO } from '@/interfaces/IComment';
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

  public createComment = async (commentInputDTO: ICommentCreateInputDTO) => {
    try {
      this.logger.silly('Creating comment record');

      const checkExistence = await this.postRepositoryInstance.getPostById(commentInputDTO.postId);
      if (!checkExistence) throw 'The post does not exist';

      const commentRecord = await this.commentRepositoryInstance.createComment({ ...commentInputDTO });
      if (!commentRecord) throw 'Comment cannot be created';
      const comment = { ...commentRecord };

      Reflect.deleteProperty(comment, 'createdAt');
      Reflect.deleteProperty(comment, 'updatedAt');

      return comment;
    } catch (e) {
      throw e;
    }
  };
}
