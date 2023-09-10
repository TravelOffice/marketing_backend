import { helper } from 'core';
import { GetOfferListOfPostUseCase } from './interfaces/GetOfferListOfPostUseCase';
import { offerRepository, tourPostRepository } from '../repositories';
import { Offer } from '../models/Offer';
import { CognitoUser } from '../models/CognitoUser';

export default class GetOfferListOfPostUseCaseImpl implements GetOfferListOfPostUseCase {
  /**
   * Retrieves the list offers of tour post by the associated tour post ID.
   *
   * @param currentUser - The current authenticated user.
   * @param tourPostId - The ID of the tour post we want to retrieve the offers for.
   * @returns A Promise that resolves to an array of offers.
   */
  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
  ): Promise<Offer[]> => {
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    let offers = [];
    // Check if current user is author of tour post
    // only author of tour post can get all offers of tour post
    if (marketplaceUserId === tourPost.authorId) {
      offers = await offerRepository.listOffersOfPost(tourPostId);
    } else {
      // Get all offers of current user for this post
      offers = await offerRepository.listOffersOfPostByUser(tourPostId, marketplaceUserId);
    }
    return offers.map(
      (offer) => helper.excludeDataFromObject(offer) as Offer,
    );
  };
}
