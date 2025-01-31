import { ICommunity, ICommunityInputDTO } from '@/interfaces/ICommunity';
import mongoose from '@/loaders/mongoose';
import CommunityModel from '@/models/community';
import UserModel from '@/models/user';
import { Service } from 'typedi';
import { Types } from 'mongoose';

@Service()
export class CommunityRepository {
  constructor() {}

  public getCommunity = async (communityId: ICommunity['_id']) => {
    try {
      const record = await CommunityModel.findOne({ _id: communityId }).lean();
      return record;
    } catch (e) {
      throw e;
    }
  };

  public getAllCommunities = async () => {
    try {
      const communities = await CommunityModel.find().lean();
      return communities;
    } catch (error) {
      throw error;
    }
  };

  public createCommunity = async (communityInputDTO: ICommunityInputDTO) => {
    try {
      const moderator = await UserModel.findOne({ _id: new Types.ObjectId(communityInputDTO.moderatorId) });

      if (!moderator) throw 'The moderator does not exists';

      const community = await CommunityModel.create({
        name: communityInputDTO.name,
        moderators: [new Types.ObjectId(communityInputDTO.moderatorId)],
        description: communityInputDTO.description,
      });
      if (community) return community.toObject();
      return null;
    } catch (error) {
      throw error;
    }
  };

  public increaseTotalMembersForCommunity = async (communityId: ICommunity['_id'], increaseBy) => {
    try {
      const record = await CommunityModel.findOneAndUpdate(
        { _id: communityId },
        { $inc: { totalMembers: increaseBy } },
        { new: true },
      ).lean();
      if (record) return record;
      return null;
    } catch (error) {
      throw error;
    }
  };
}
