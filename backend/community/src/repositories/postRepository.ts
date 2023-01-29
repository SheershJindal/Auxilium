import { Service } from 'typedi';
import PostModel from '@/models/post';
import { IPost, IPostInputDTO } from '@/interfaces/IPost';
import { Types } from 'mongoose';

@Service()
export class PostRepository {
  constructor() {}

  public getPostById = async (postId: IPost['_id']) => {
    try {
      const record = await PostModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(postId),
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $addFields: {
            username: '$user.username',
            userRole: '$user.role',
            isUserBanned: '$user.isBanned',
          },
        },
        {
          $project: {
            user: 0,
          },
        },
      ]).limit(1);
      if (!record || record.length == 0) return null;
      return record[0];
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

  public getPostsForCommunityPaginated = async (
    communityId: IPost['communityId'],
    pageNumber: number,
    limit: number,
  ) => {
    try {
      const posts = await PostModel.aggregate([
        { $match: { communityId: new Types.ObjectId(communityId) } },
        { $sort: { createdAt: -1 } },
        { $skip: pageNumber * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        { $addFields: { username: '$user.username', isUserBanned: '$user.isBanned' } },
        { $project: { user: 0 } },
      ]);
      return posts;
    } catch (e) {
      throw e;
    }
  };
}
