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
    const offer = {
      ...createOfferDto,
      code: offerIndex,
      authorId,
      tourPostId,
      sentOrg,
      createdAt,
      updatedAt,
      summitedAt: now,
      offerStatus: OfferStatus.IN_PROCESS,
      lsi1: `${sentOrg}#${createdAt}`, // Get all sent offers of the organization
      lsi2: `${authorId}#${createdAt}`, // Get all sent offers of the user
      lsi3: `${tourPostId}#${createdAt}`, // Get all offers of the post
      lsi4: `${receivedOrg}#${createdAt}`, // Get all received offers by organization
      lsi5: `${receivedUser}#${createdAt}`, // Get all received offers by user
      receivedOrg,
      receivedUser,
    } as Offer;

    // Add the offer to DynamoDB using the repository
    const createdOffer = await offerRepository.create(offer);
    return helper.excludeDataFromObject(createdOffer) as Offer;
  };
}
