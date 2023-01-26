import { Service } from 'typedi';
import PostModel from '@/models/post';
import { IPost, IPostInputDTO } from '@/interfaces/IPost';

@Service()
export class PostRepository {
  constructor() {}

  public createPost = async (postInputDTO: IPostInputDTO): Promise<IPost | null> => {
    try {
      const post = await PostModel.create({ ...postInputDTO });
      if (post) return post.toObject();
      return null;
    } catch (e) {
      throw e;
    }
  };
}
