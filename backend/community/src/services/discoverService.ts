import { IUser } from '@/interfaces/IUser';
import { PostRepository } from '@/repositories/postRepository';
import { Service } from 'typedi';

@Service()
export class DiscoverService {
  protected postRepositoryInstance: PostRepository;
  constructor(postRepository: PostRepository) {
    this.postRepositoryInstance = postRepository;
  }

  public getCustomisedDiscover = async (userId: IUser['_id'], pageNumber = 0, limit = 10) => {
    const posts = await this.postRepositoryInstance.getPostsForDisover(userId, pageNumber, limit);
    return posts;
  };
}
