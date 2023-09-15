import { helper } from 'core';
import { marketplaceUserRepository } from '../repositories';
import { UpdateMarketplaceUserUseCase } from './interfaces/UpdateMarketplaceUserUseCase';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import { MarketplaceUser } from '../models';

export default class UpdateMarketplaceUserUseCaseImpl implements UpdateMarketplaceUserUseCase {
  allowedUpdatingKeys: (keyof UpdateUserDto)[] = [
    'alias',
    'description',
    'settings',
    'avatar',
  ];

  invoke = async (
    tenant: string,
    username: string,
    updateUserDto: UpdateUserDto,
  ) => {
    const id = `${tenant}#${username}`;
    // Check user exists
    const marketplaceUser = await marketplaceUserRepository.getById(id);
    if (!marketplaceUser || !marketplaceUser.enabled) {
      throw new Error('Marketplace user not found');
    }

    // Extract data to update
    const allowedUpdatingData = helper.extractDataFromObject(
      updateUserDto,
      this.allowedUpdatingKeys,
    );
    const updatingUserData = await this.getDataToUpdate(marketplaceUser, allowedUpdatingData);
    // Delete old user avatar
    if (updateUserDto.avatar) {
      await marketplaceUserRepository.deleteAvatar(marketplaceUser.avatar);
    }
    return marketplaceUserRepository.update(id, updatingUserData);
  };

  /**
   * Transform dto to expected data which should be used to update.
   * Also, some kinds of data should be validated before updating.
   * @param user Current marketplace user
   * @param updatingUserData Data to update
   */
  private async getDataToUpdate(
    user: MarketplaceUser,
    updatingUserData: Partial<UpdateUserDto>,
  ) {
    // New data to update
    return {
      ...updatingUserData,
      updatedAt: Date.now(),
    };
  }
}
