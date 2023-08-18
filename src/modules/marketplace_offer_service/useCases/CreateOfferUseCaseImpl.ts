import { helper } from 'core';
import { marketplaceUserRepository, offerRepository, tourPostRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';
import { OFFER_INDEX, ORG_INDEX } from '../utils/constants';
import { CreateOfferUseCase } from './interfaces/CreateOfferUseCase';
import { CreateOfferDto } from '../dto/CreateOfferDto';
import { Offer, OfferStatus } from '../models/Offer';

export default class CreateOfferUseCaseImpl implements CreateOfferUseCase {
  /**
   * Creates an offer on a tour post by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {string} tourPostId - The ID of the tour post for which the rating is being created.
   * @param {CreateOfferDto} createOfferDto - The data for creating the offer.
   * @returns {Promise<Offer>} - A promise resolving to the created post rating.
   */
  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Retrieve the tour post form the repository
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    // Get the current timestamp
    const now = Date.now();

    // Generate a unique index for the rating
    const offerIndex = await offerRepository.generateCode();

    // Create the offer object
    const offer = {
      ...createOfferDto,
      code: offerIndex,
      authorId: marketplaceUserId,
      tourPostId,
      organizationId: tourPost.tenant,
      createdAt: now,
      updatedAt: now,
      summitedAt: now,
      offerStatus: OfferStatus.IN_PROCESS,
      // Local secondary index with format <tenant>#<username>
      // for getting offer created by specific user
      lsi1: marketplaceUserId,
      lsi2: `${OFFER_INDEX}#${OfferStatus.IN_PROCESS}`,
      receivedOrg: `${OFFER_INDEX}#${ORG_INDEX}#${tourPost.tenant}`,
    } as Offer;

    // Add the offer to DynamoDB using the repository
    const createdOffer = await offerRepository.create(offer);
    return helper.excludeDataFromObject(createdOffer) as Offer;
  };
}
