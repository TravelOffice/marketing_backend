import { helper } from 'core';
import { marketplaceUserRepository, offerRepository, tourPostRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';
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
    const { tenant: sentOrg, username } = currentUser;
    const authorId = `${sentOrg}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(authorId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Retrieve the tour post form the repository
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    // Org of the user who sent offer must be different from the org of the post
    if (sentOrg === tourPost.organization) {
      throw new Error('Cannot send an offer to a post from your own organization');
    }

    // User who sent offer must be different from the author of the post
    if (authorId === tourPost.authorId) {
      throw new Error('Cannot send offer to yourself');
    }

    const receivedOrg = tourPost.organization;
    const receivedUser = tourPost.authorId;

    // Get the current timestamp
    const now = Date.now();
    const createdAt = now;
    const updatedAt = now;

    // Generate a unique index for the rating
    const offerIndex = await offerRepository.generateCode();

    // Create the offer object
    const offerStatus = OfferStatus.IN_PROCESS;
    const offer = {
      ...createOfferDto,
      code: offerIndex,
      authorId,
      tourPostId,
      sentOrg,
      createdAt,
      updatedAt,
      summitedAt: now,
      offerStatus,
      receivedOrg,
      receivedUser,
    } as Offer;

    // Add the offer to DynamoDB using the repository
    const createdOffer = await offerRepository.create(offer);
    return helper.excludeDataFromObject(createdOffer) as Offer;
  };
}
