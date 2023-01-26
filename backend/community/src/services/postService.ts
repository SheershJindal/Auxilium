import { IPostInputDTO } from '@/interfaces/IPost';
import { PostRepository } from '@/repositories/postRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export class PostService {
  protected postRepositoryInstance: PostRepository;
  constructor(postRepository: PostRepository, @Inject('logger') private logger: Logger) {
    this.postRepositoryInstance = postRepository;
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
}
