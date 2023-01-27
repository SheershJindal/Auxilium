import { ICommunityInputDTO } from '@/interfaces/ICommunity';
import { IUserCommunity } from '@/interfaces/IUserCommunity';
import { CommunityRepository } from '@/repositories/communityRepository';
import { UserCommunityRepository } from '@/repositories/userCommunityRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export default class CommunityService {
  protected communityRepositoryInstance: CommunityRepository;
  protected userCommunityRepositoryInstance: UserCommunityRepository;

  constructor(
    communityRepository: CommunityRepository,
    userCommunityRepository: UserCommunityRepository,
    @Inject('logger') private logger: Logger,
  ) {
    this.communityRepositoryInstance = communityRepository;
    this.userCommunityRepositoryInstance = userCommunityRepository;
  }

  public createCommunity = async (communityInputDTO: ICommunityInputDTO) => {
    try {
      this.logger.silly('Creating community record');

      const communityRecord = await this.communityRepositoryInstance.createCommunity(communityInputDTO);

      if (!communityRecord) {
        throw 'Community cannot be created';
      }

      const community = { ...communityRecord };

      Reflect.deleteProperty(community, 'createdAt');
      Reflect.deleteProperty(community, 'updatedAt');

      return { community };
    } catch (error) {
      throw error;
    }
  };

  public subscribeToCommunity = async (
    userId: IUserCommunity['userId'],
    communityId: IUserCommunity['communityId'],
  ) => {
    this.logger.silly('Creating userCommunities record');
    try {
      const userCommunitiesRecord = await this.userCommunityRepositoryInstance.subscribeUserToCommunity(
        userId,
        communityId,
      );
      if (!userCommunitiesRecord) throw 'Cannot subscribe to the community';
      
      const updatedCommunity = await this.communityRepositoryInstance.increaseTotalMembersForCommunity(communityId, 1);

      const userCommunity = { ...userCommunitiesRecord };

      Reflect.deleteProperty(userCommunity, '_id');
      Reflect.deleteProperty(userCommunity, 'createdAt');
      Reflect.deleteProperty(userCommunity, 'updatedAt');

      return userCommunity;
    } catch (error) {
      throw error;
    }
  };

  public leaveCommunity = async (userId: IUserCommunity['userId'], communityId: IUserCommunity['communityId']) => {
    try {
      const status = await this.userCommunityRepositoryInstance.deleteUserFromCommunity(userId, communityId);
      if (status.deletedCount == 0) throw 'You are not subscribed to this community';

      const community = await this.communityRepositoryInstance.increaseTotalMembersForCommunity(communityId, -1);

      return `Successfully left ${community.name}`;
    } catch (error) {
      throw error;
    }
  };

  public getAllCommunitiesForUser = async (userId: IUserCommunity['userId']) => {
    this.logger.silly('Getting all user subscribed communities');
    try {
      const userCommunitiesRecords = await this.userCommunityRepositoryInstance.getAllCommunitiesForUser(userId);
      const results = userCommunitiesRecords.map(({ createdAt, updatedAt, ...restData }) => restData);

      return results;
    } catch (error) {
      throw error;
    }
  };
}
