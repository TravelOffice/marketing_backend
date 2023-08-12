import { helper } from 'core';
import { postCommentRepository } from '../repositories';
import { GetPostCommentUseCase } from './interfaces/GetPostCommentUseCase';
import { PostComment } from '../models/PostComment';

export default class GetPostCommentUseCaseImpl implements GetPostCommentUseCase {
  /**
   * Retrieves a specific post comment by its ID and the associated tour post ID.
   *
   * @param {string} tourPostId - The ID of the tour post associated with the comment.
   * @param {string} commentId - The ID of the comment to be retrieved.
   * @returns {Promise<PostComment | undefined>} - A promise resolving to the retrieved post comment
   * or undefined if not found.
   */
  invoke = async (tourPostId: string, commentId: string): Promise<PostComment | undefined> => {
    // Retrieve the comment using postCommentRepository.get
    const comment = await postCommentRepository.get(tourPostId, commentId);

    // Check if the comment exists
    if (!comment) {
      return undefined; // Return undefined if the comment is not found
    }

    // Exclude unnecessary data from the comment object and return as PostComment
    return helper.excludeDataFromObject(comment) as PostComment;
  };
}
