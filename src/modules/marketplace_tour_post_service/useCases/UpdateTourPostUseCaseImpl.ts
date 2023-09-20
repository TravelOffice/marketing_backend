import { helper } from 'core';
import { UpdateTourPostDto } from '../dto/UpdateTourPostDto';
import { CognitoUser } from '../models/CognitoUser';
import { TourPost } from '../models/TourPost';
import { statusTransitionRules } from '../models/TourPostStatus';
import { marketplaceUserRepository, tourPostRepository } from '../repositories';
import { UpdateTourPostUseCase } from './interfaces/UpdateTourPostUseCase';

export default class UpdateTourPostUseCaseImpl implements UpdateTourPostUseCase {
  allowedUpdatingKeys: (keyof UpdateTourPostDto)[] = [
    'name',
    'description',
    'status',
    'expiry',
    'autoClose',
    'maximumPaxToTrade',
    'endingLocation',
    'departureDate',
    'thumbnail',
    'commission',
    'pricePerPax',
  ];

  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
    updateTourPostDto: UpdateTourPostDto,
  ) => {
    // Check user exists
    const { tenant, username } = currentUser;
    const marketplaceUser = await marketplaceUserRepository.getById(`${tenant}#${username}`);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Check if the current user is the owner of the tour post
    const marketplaceUserId = marketplaceUser.id;
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    if (tourPost.authorId !== marketplaceUserId) {
      throw new Error('Only the owner of the tour post can update it');
    }

    // Extract data to update
    const allowedUpdatingData = helper.extractDataFromObject(
      updateTourPostDto,
      this.allowedUpdatingKeys,
    );
    const updatingTourPostData = await this.getDataToUpdate(tourPost, allowedUpdatingData);
    const updatedTourPost = await tourPostRepository.update(tourPostId, updatingTourPostData);
    if (updateTourPostDto.thumbnail && updateTourPostDto.thumbnail !== tourPost.thumbnail) {
      // Delete Old thumbnail
      await tourPostRepository.deleteThumbnail(tourPost.thumbnail);
    }
    return helper.excludeDataFromObject(updatedTourPost as TourPost) as TourPost;
  };

  /**
   * Transform dto to expected data which should be used to update.
   * Also, some kinds of data should be validated before updating.
   * @param tourPost Current tour post
   * @param updatingTourPostData Data to update
   */
  private async getDataToUpdate(
    tourPost: TourPost,
    updatingTourPostData: Partial<UpdateTourPostDto>,
  ): Promise<Partial<UpdateTourPostDto>> {
    // Verify status change
    // Status transition must follow the defined rules
    const currentStatus = tourPost.status;
    const newStatus = updatingTourPostData?.status;
    if (newStatus && currentStatus !== newStatus) {
      const statusTransition = `${currentStatus}-${newStatus}`;
      if (!statusTransitionRules.includes(statusTransition)) {
        throw new Error(`Can not change status from ${currentStatus} to ${newStatus}`);
      }
    }

    const updatedAt = Date.now();
    const {
      endingLocation: newEndingLocation, departureDate: newDepartureDate,
    } = updatingTourPostData;
    const dataToUpdate: Partial<TourPost> = { ...updatingTourPostData, updatedAt };
    if (newStatus) {
      dataToUpdate.lsi1 = tourPost.lsi1?.replace(currentStatus, newStatus);
      dataToUpdate.lsi2 = tourPost.lsi2?.replace(currentStatus, newStatus);
      dataToUpdate.lsi3 = tourPost.lsi3?.replace(currentStatus, newStatus);
      dataToUpdate.lsi4 = tourPost.lsi4?.replace(currentStatus, newStatus);
      dataToUpdate.lsi5 = tourPost.lsi5?.replace(currentStatus, newStatus);
    }

    if (newEndingLocation) {
      dataToUpdate.lsi4 = newStatus ? `${newEndingLocation}#${newStatus}#${tourPost.createdAt}` : `${newEndingLocation}#${tourPost.status}#${tourPost.createdAt}`;
    }
    if (newDepartureDate) {
      dataToUpdate.lsi5 = newStatus ? `${newDepartureDate}#${newStatus}#${tourPost.createdAt}` : `${newDepartureDate}#${tourPost.status}#${tourPost.createdAt}`;
    }
    // New data to update
    return dataToUpdate as UpdateTourPostDto;
  }
}
