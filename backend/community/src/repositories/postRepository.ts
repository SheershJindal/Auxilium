import { Service } from 'typedi';
import PostModel from '@/models/post';
import { IPost, IPostInputDTO } from '@/interfaces/IPost';

@Service()
export class PostRepository {
  constructor() {}

  public getPostById = async (postId: IPost['_id']) => {
    try {
      const record = await PostModel.findOne({ _id: postId }).lean();
      return record;
    } catch (e) {
      throw e;
    }
  };
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
