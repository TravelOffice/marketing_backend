import { helper } from 'core';
import { offerRepository, tourPostRepository } from '../repositories';
import { Offer, OfferStatus } from '../models/Offer';
import { RejectOfferUseCase } from './interfaces/RejectOfferUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { OFFER_INDEX } from '../utils/constants';

export default class RejectOfferUseCaseImpl implements RejectOfferUseCase {
  /**
   * Reject an offer by its ID and the associated tour post ID.
   *
   * @param {string} currentUser - The current authenticated user.
   * @param {string} tourPostId - The ID of the tour post associated with the offer.
   * @param {string} offerId - The ID of the offer to be rejected.
   * @param {string} rejectReason - The reason for rejecting the offer.
   * @returns {Promise<Offer | undefined>} - A promise resolving to the rejected offer
   * or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
    offerId: string,
    rejectReason: string,
  ): Promise<Offer> => {
    // Extract necessary information from the current user
    const { tenant: organizationId, username } = currentUser;
    const marketplaceUserId = `${organizationId}#${username}`;

    // Retrieve the offer to be rejected
    const offer = await offerRepository.get(organizationId, tourPostId, offerId);
    // Check if the offer exists, if not, throw an error you are not authorized to reject this offer
    if (!offer) {
      throw new Error('You are not authorized to reject this offer');
    }

    // Check if status of offer is IN_PROCESS
    if (offer.offerStatus !== OfferStatus.IN_PROCESS) {
      throw new Error('Only reject offer with status IN_PROCESS');
    }

    // Retrieve the tour post
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    // Check if the current user is the owner of the tour post
    if (tourPost.authorId !== marketplaceUserId) {
      throw new Error('Only the owner of the tour post can reject it');
    }

    // Reject the offer
    const rejectedOffer = await offerRepository.update(organizationId, tourPostId, offerId, {
      offerStatus: OfferStatus.REJECTED,
      rejectReason,
      lsi2: `${OFFER_INDEX}#${OfferStatus.REJECTED}`,
      rejectedAt: Date.now(),
    });

    // Exclude unnecessary data from the offer object and return as Offer
    return helper.excludeDataFromObject(rejectedOffer) as Offer;
  };
}
