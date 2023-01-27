import { ICommentCreateInputDTO } from '@/interfaces/IComment';
import CommentModel from '@/models/comment';
import { Service } from 'typedi';

@Service()
export class CommentRepository {
  constructor() {}

  public createComment = async (commentInputDTO: ICommentCreateInputDTO) => {
    try {
      const comment = await CommentModel.create({ ...commentInputDTO });
      if (comment) return comment.toObject();
      return null;
    } catch (e) {
      throw e;
    }
  };
}
