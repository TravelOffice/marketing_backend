import { helper } from 'core';
import { postRatingRepository } from '../repositories';
import { GetPostRatingUseCase } from './interfaces/GetPostRatingUseCase';
import { PostRating } from '../models/PostRating';

export default class GetPostRatingUseCaseImpl implements GetPostRatingUseCase {
  /**
   * Retrieves a specific post rating by its ID and the associated tour post ID.
   *
   * @param {string} tourPostId - The ID of the tour post associated with the rating.
   * @param {string} ratingId - The ID of the rating to be retrieved.
   * @returns {Promise<PostRating | undefined>} - A promise resolving to the retrieved post rating
   * or undefined if not found.
   */
  invoke = async (tourPostId: string, ratingId: string): Promise<PostRating | undefined> => {
    // Retrieve the rating using postRatingRepository.get
    const rating = await postRatingRepository.get(tourPostId, ratingId);

    // Check if the rating exists
    if (!rating) {
      return undefined; // Return undefined if the rating is not found
    }

    // Exclude unnecessary data from the rating object and return as PostRating
    return helper.excludeDataFromObject(rating) as PostRating;
  };
}
