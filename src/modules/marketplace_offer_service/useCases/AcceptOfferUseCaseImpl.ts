import { helper } from 'core';
import { offerRepository, tourPostRepository } from '../repositories';
import { Offer, OfferStatus } from '../models/Offer';
import { CognitoUser } from '../models/CognitoUser';
import { AcceptOfferUseCase } from './interfaces/AcceptOfferUseCase';
import { OFFER_INDEX } from '../utils/constants';

export default class AcceptOfferUseCaseImpl implements AcceptOfferUseCase {
  /**
   * Accept an offer by its ID and the associated tour post ID.
   *
   * @param {string} currentUser - The current authenticated user.
   * @param {string} organizationId - The ID of the organization associated with the offer.
   * @param {string} tourPostId - The ID of the tour post associated with the offer.
   * @param {string} offerId - The ID of the offer to be accepted.
   * @returns {Promise<Offer | undefined>} - A promise resolving to the accepted offer
   * or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    organizationId: string,
    tourPostId: string,
    offerId: string,
  ): Promise<Offer> => {
    // Extract necessary information from the current user
    const { tenant: userOrganizationId, username } = currentUser;
    const marketplaceUserId = `${userOrganizationId}#${username}`;

    // Retrieve the tour post
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    // Check if the current user is the owner of the tour post
    if (tourPost.authorId !== marketplaceUserId) {
      throw new Error('Only the owner of the tour post can accept it');
    }

    // Retrieve the offer to be accepted
    const offer = await offerRepository.get(organizationId, tourPostId, offerId);
    // Check if the offer exists
    if (!offer) {
      throw new Error(`Offer ${offerId} not found for tour post ${tourPostId} and organization ${organizationId}`);
    }

    // Check if status of offer is IN_PROCESS
    if (offer.offerStatus !== OfferStatus.IN_PROCESS) {
      throw new Error('Only accept offer with status IN_PROCESS');
    }

    // Accept the offer
    const acceptedOffer = await offerRepository.update(organizationId, tourPostId, offerId, {
      offerStatus: OfferStatus.ACCEPTED,
      lsi2: `${OFFER_INDEX}#${OfferStatus.ACCEPTED}`,
      acceptedAt: Date.now(),
    });

    // Exclude unnecessary data from the offer object and return as Offer
    return helper.excludeDataFromObject(acceptedOffer) as Offer;
  };
}
