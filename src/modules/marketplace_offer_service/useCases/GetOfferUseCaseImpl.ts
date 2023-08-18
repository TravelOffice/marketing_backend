import { helper } from 'core';
import { offerRepository } from '../repositories';
import { GetOfferUseCase } from './interfaces/GetOfferUseCase';
import { Offer } from '../models/Offer';
import { CognitoUser } from '../models/CognitoUser';

export default class GetOfferUseCaseImpl implements GetOfferUseCase {
  /**
   * Retrieves a specific offer by its ID and the associated tour post ID.
   *
   * @param {string} currentUser - The current authenticated user.
   * @param {string} offerId - The ID of the offer to be retrieved.
   * @returns {Promise<Offer | undefined>} - A promise resolving to the retrieved offer
   * or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    offerId: string,
  ): Promise<Offer | undefined> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Retrieve the offer
    const offer = await offerRepository.get(offerId);

    // Check if the offer exists
    if (!offer) {
      throw new Error(`Offer with ID ${offerId} not found`);
    }

    // Check if the current user is the owner of the tour post or the offer
    // Only the owner of the tour post or the offer can get the offer
    if (marketplaceUserId !== offer?.receivedUser && marketplaceUserId !== offer?.authorId) {
      throw new Error('You are not authorized to access this resource');
    }

    // Exclude unnecessary data from the offer object and return as Offer
    return helper.excludeDataFromObject(offer) as Offer;
  };
}
