import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import logger from '../utils/logger';
import { UnbookmarkTourPostUseCase } from './interfaces/UnbookmarkTourPostUseCase';

export default class UnbookmarkTourPostUseCaseImpl implements UnbookmarkTourPostUseCase {
  invoke = async (currentUser: CognitoUser, tourPostId: string) => {
    // Tour post must be existed
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }
    // Check if user already bookmarked this post
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    const bookmarkedItem = await tourPostRepository.getBookmarkedItem(userId, tourPostId);
    if (!bookmarkedItem) {
      throw new Error(`Bookmark item not found for user ${userId} and tour post ${tourPostId}`);
    }

    // Unbookmark item
    await tourPostRepository.unbookmark(userId, tourPostId);
    logger.log(`Unbookmarked tour post with id ${tourPostId} successfully for user ${userId}`);
  };
}
