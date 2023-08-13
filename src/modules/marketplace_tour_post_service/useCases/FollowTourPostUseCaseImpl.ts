import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import logger from '../utils/logger';
import { FollowTourPostUseCase } from './interfaces/FollowTourPostUseCase';

export default class FollowTourPostUseCaseImpl implements FollowTourPostUseCase {
  invoke = async (currentUser: CognitoUser, tourPostId: string) => {
    // Tour post must be existed
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }
    // Check if user already followed this post
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    const followedItem = await tourPostRepository.getFollowedItem(userId, tourPostId);
    if (!followedItem) {
      // Follow item
      const item = tourPostRepository.follow(userId, tourPostId);
      logger.log(`Followed tour post with id ${tourPostId} successfully for user ${userId}`);
      return item;
    }
    return followedItem;
  };
}
