import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import logger from '../utils/logger';
import { UnfollowTourPostUseCase } from './interfaces/UnfollowTourPostUseCase';

export default class UnfollowTourPostUseCaseImpl implements UnfollowTourPostUseCase {
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
      throw new Error(`Followed item not found for user ${userId} and tour post ${tourPostId}`);
    }

    // Unfollow item
    await tourPostRepository.unfollow(userId, tourPostId);
    logger.log(`Unfollowed tour post with id ${tourPostId} successfully for user ${userId}`);
  };
}
