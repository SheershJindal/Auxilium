import { IComment, ICommentCreateInputDTO } from '@/interfaces/IComment';
import { IPostInputDTO } from '@/interfaces/IPost';
import { PostService } from '@/services/postService';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

@Service()
export class PostController {
  protected postServiceInstance: PostService;
  protected logger: Logger;

  constructor(postService: PostService, @Inject('logger') logger: Logger) {
    this.postServiceInstance = postService;
    this.logger = logger;
  }

  public createPost = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling Create Post endpoint with %o', { body: req.body, params: req.params });

    try {
      const userId = req.currentUser.userId;
      const type = req.body.type as IPostInputDTO['type'];
      const data = req.body.data as IPostInputDTO['data'];
      const communityId = req.params.communityId as unknown as IPostInputDTO['communityId'];

      const post = await this.postServiceInstance.createPost({ userId, communityId, data, type });
      return res.status(200).json(Result.success(post));
    } catch (error) {
      this.logger.error('🔥 error: %o', error);
      return next(error);
    }
  };

  public createComment = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling Create Comment endpoint with %o', { body: req.body, params: req.params });

    try {
      const userId = req.currentUser.userId;
      const postId = req.params.postId as unknown as ICommentCreateInputDTO['postId'];
      const content = req.body.content;
      const parentId = req.body.parentId || null;

      const comment = await this.postServiceInstance.createComment({ userId, postId, content, parentId });
      return res.status(200).json(Result.success(comment));
    } catch (error) {
      this.logger.error('🔥 error: %o', error);
      return next(error);
    }
  };

  public likeUnlikeComment = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling Like/Unlike Comment endpoint with %o', { body: req.body, params: req.params });

    try {
      const userId = req.currentUser.userId;
      const commentId = req.params.commentId as unknown as IComment['_id'];

      const comment = await this.postServiceInstance.likeUnlikeComment(userId, commentId);

      return res.status(200).json(Result.success(comment));
    } catch (error) {
      this.logger.error('🔥 error: %o', error);
      return next(error);
    }
  };

  public dislikeUndislikeComment = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling Dislike/Undislike Comment endpoint with %o', { body: req.body, params: req.params });

    try {
      const userId = req.currentUser.userId;
      const commentId = req.params.commentId as unknown as IComment['_id'];

      const comment = await this.postServiceInstance.dislikeUndislikeComment(userId, commentId);

      return res.status(200).json(Result.success(comment));
    } catch (error) {
      this.logger.error('🔥 error: %o', error);
      return next(error);
    }
  };
}
