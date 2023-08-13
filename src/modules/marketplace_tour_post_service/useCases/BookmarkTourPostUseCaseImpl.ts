import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import logger from '../utils/logger';
import { BookmarkTourPostUseCase } from './interfaces/BookmarkTourPostUseCase';

export default class BookmarkTourPostUseCaseImpl implements BookmarkTourPostUseCase {
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
      // Bookmark item
      const item = tourPostRepository.bookmark(userId, tourPostId);
      logger.log(`Bookmarked tour post with id ${tourPostId} successfully for user ${userId}`);
      return item;
    }
    return bookmarkedItem;
  };
}
