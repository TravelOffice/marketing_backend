import { helper } from 'core';
import { UpdateTourPostDto } from '../dto/UpdateTourPostDto';
import { CognitoUser } from '../models/CognitoUser';
import { TourPost } from '../models/TourPost';
import { statusTransitionRules } from '../models/TourPostStatus';
import { marketplaceUserRepository, tourPostRepository } from '../repositories';
import { UpdateTourPostUseCase } from './interfaces/UpdateTourPostUseCase';
import { CreateTourPostDto } from '../dto/CreateTourPostDto';

export default class UpdateTourPostUseCaseImpl implements UpdateTourPostUseCase {
  allowedUpdatingKeys: (keyof UpdateTourPostDto)[] = [
    'name',
    'description',
    'type',
    'linkedToTargetKeys',
    'status',
    'expiry',
    'autoClose',
    'maximumPaxToTrade',
    'endingLocation',
    'departureDate',
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
    // TODO: Otherwise, only admin can update the tour post
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
    if (currentStatus !== newStatus) {
      const statusTransition = `${currentStatus}-${newStatus}`;
      if (!statusTransitionRules.includes(statusTransition)) {
        throw new Error(`Can not change status from ${currentStatus} to ${newStatus}`);
      }
    }

    const updatedAt = Date.now();
    const {
      endingLocation: newEndingLocation, departureDate: newDepartureDate,
    } = updatingTourPostData;
    // New data to update
    return {
      ...updatingTourPostData,
      updatedAt,
      lsi2: newStatus, // Local index for getting all posts by specific status
      lsi4: `${newEndingLocation ?? tourPost.endingLocation}#${tourPost.createdAt}`,
      lsi5: `${newDepartureDate ?? tourPost.departureDate}`,
    } as CreateTourPostDto;
  }
}
