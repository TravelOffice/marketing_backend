import { helper } from 'core';
import { marketplaceUserRepository, offerRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';
import { UpdateOfferUseCase } from './interfaces/UpdateOfferUseCase';
import { UpdateOfferDto } from '../dto/UpdateOfferDto';
import { Offer } from '../models/Offer';

export default class UpdateOfferUseCaseImpl implements UpdateOfferUseCase {
  private allowedUpdatingKeys: (keyof UpdateOfferDto)[] = [
    'description', 'totalPax', 'pricePerPax', 'commissionRate',
  ];

  /**
   * Updates an offer by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {UpdateOfferDto} updateOfferDto - The data for updating the offer.
   * @returns {Promise<Offer>} - A promise indicating the success of the update.
   */
  invoke = async (
    currentUser: CognitoUser,
    updateOfferDto: UpdateOfferDto,
  ): Promise<Offer> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Extract necessary information from updateOfferDto
    const { code: offerId } = updateOfferDto;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Get the ID of the marketplace user
    const currentUserId = marketplaceUser.id;

    // Retrieve the offer to be updated
    const offer = await offerRepository.get(offerId);
    if (!offer) {
      throw new Error(`Offer not found with ID ${offerId}`);
    }

    // Check if the current user is the owner of the offer
    if (offer.authorId !== currentUserId) {
      throw new Error('Only the owner of the offer can update it');
    }

    // Check if status of offer is IN_PROCESS
    // Only update offer with status IN_PROCESS
    if (offer.offerStatus !== 'IN_PROCESS') {
      throw new Error('Only update offer with status IN_PROCESS');
    }

    // Extract data from the updateOfferDto based on allowed keys
    const allowedUpdatingData = helper.extractDataFromObject(
      updateOfferDto,
      this.allowedUpdatingKeys,
    );

    // Get updated data for the offer
    const updatingOfferData = await this.getDataToUpdate(offer, allowedUpdatingData);

    // Update the offer using the repository
    const updatedOffer = await offerRepository.update(
      offerId,
      updatingOfferData,
    );
    return helper.excludeDataFromObject(updatedOffer) as Offer;
  };

  /**
   * Transform dto to expected data which should be used to update.
   * Also, some kinds of data should be validated before updating.
   * @param offer - Current offer in the database.
   * @param updatingOfferData - The data for updating the offer.
   */
  private async getDataToUpdate(
    offer: Offer,
    updatingOfferData: Partial<UpdateOfferDto>,
  ): Promise<Partial<Offer>> {
    let dataToUpdate: Partial<Offer> = {};
    const props = Object.keys(updatingOfferData);

    props.forEach((key) => {
      const prop = key as keyof UpdateOfferDto;
      if (offer[prop] !== updatingOfferData[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updatingOfferData[prop] };
      }
    });
    // New data to update
    return {
      ...updatingOfferData,
      updatedAt: Date.now(),
    };
  }
}
