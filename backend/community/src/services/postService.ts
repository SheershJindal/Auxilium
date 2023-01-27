import { ICommentCreateInputDTO } from '@/interfaces/IComment';
import { IPostInputDTO } from '@/interfaces/IPost';
import { CommentRepository } from '@/repositories/commentRepository';
import { PostRepository } from '@/repositories/postRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export class PostService {
  protected postRepositoryInstance: PostRepository;
  protected commentRepositoryInstance: CommentRepository;

  constructor(
    postRepository: PostRepository,
    commentRepository: CommentRepository,
    @Inject('logger') private logger: Logger,
  ) {
    this.postRepositoryInstance = postRepository;
    this.commentRepositoryInstance = commentRepository;
  }

  public createPost = async (postInputDTO: IPostInputDTO) => {
    try {
      this.logger.silly('Creating post record');

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

      const commentRecord = await this.commentRepositoryInstance.createComment({...commentInputDTO});
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
