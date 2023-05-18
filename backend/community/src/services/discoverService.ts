import { IUser } from '@/interfaces/IUser';
import { CommunityRepository } from '@/repositories/communityRepository';
import { PostRepository } from '@/repositories/postRepository';
import { Service } from 'typedi';

@Service()
export class DiscoverService {
  protected postRepositoryInstance: PostRepository;
  protected communityRepositoryInstance: CommunityRepository;
  constructor(postRepository: PostRepository, communityRepository: CommunityRepository) {
    this.postRepositoryInstance = postRepository;
    this.communityRepositoryInstance = communityRepository;
  }

  public getCustomisedDiscover = async (userId: IUser['_id'], pageNumber = 0, limit = 10) => {
    const allCommunities = await this.communityRepositoryInstance.getAllCommunities();
    const promises = [];
    allCommunities.map(community => {
      promises.push(this.postRepositoryInstance.getPostsForCommunityPaginated(community._id, pageNumber, limit));
    });
    const posts = await Promise.all(promises);
    const allPosts = [];
    posts.map(post => {
      allPosts.push(...post);
    });
    allPosts.sort((post1, post2) => post2.createdAt - post1.createdAt);

    const postsArr = allPosts.map(post => {
      let likedByMe = false;
      let dislikedByMe = false;
      for (let likedId of post.likedBy) {
        if (likedId == userId) {
          likedByMe = true;
          break;
        }
      }
      if (!likedByMe)
        for (let dislikedId of post.dislikedBy) {
          if (dislikedId == userId) {
            dislikedByMe = true;
            break;
          }
        }
      post['likedByMe'] = likedByMe;
      post['dislikedByMe'] = dislikedByMe;
      post['createdBy'] = {};
      post['createdBy']['_id'] = post.userId;
      post['createdBy']['username'] = post.username;
      post['createdBy']['profilePhotoUrl'] =
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

      delete post.userId;
      delete post.likedBy;
      delete post.dislikedBy;
      delete post.__v;
      delete post.isUserBanned;
      delete post.username;
      return post;
    });
    return postsArr;
  };
}
