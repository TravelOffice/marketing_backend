import { helper } from 'core';
import { offerRepository } from '../repositories';
import { Offer, OfferStatus } from '../models/Offer';
import { CancelOfferUseCase } from './interfaces/CancelOfferUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class CancelOfferUseCaseImpl implements CancelOfferUseCase {
  /**
   * Cancel an offer by its ID and the associated tour post ID.
   *
   * @param {string} currentUser - The current authenticated user.
   * @param {string} offerId - The ID of the offer to be canceled.
   * @param {string} cancelReason - The reason for canceling the offer.
   * @returns {Promise<Offer | undefined>} - A promise resolving to the canceled offer
   * or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    offerId: string,
    cancelReason: string,
  ): Promise<Offer> => {
    // Extract necessary information from the current user
    const { tenant: organization, username } = currentUser;
    const marketplaceUserId = `${organization}#${username}`;

    // Retrieve the offer to be canceled
    const offer = await offerRepository.get(offerId);
    // If offer not found, throw an error you are not authorized to cancel this offer
    if (!offer) {
      throw new Error('You are not authorized to cancel this offer');
    }

    // Check if status of offer is IN_PROCESS
    if (offer.offerStatus !== OfferStatus.IN_PROCESS) {
      throw new Error('Only cancel offer with status IN_PROCESS');
    }

    // Check if the current user is the owner of the offer
    if (offer.authorId !== marketplaceUserId) {
      throw new Error('Only the owner of the offer can cancel it');
    }

    // Cancel the offer
    const canceledOffer = await offerRepository.update(offerId, {
      offerStatus: OfferStatus.CANCELLED,
      cancelReason,
      canceledAt: Date.now(),
      updatedAt: Date.now(),
    }, offer);

    // Exclude unnecessary data from the offer object and return as Offer
    return helper.excludeDataFromObject(canceledOffer) as Offer;
  };
}
