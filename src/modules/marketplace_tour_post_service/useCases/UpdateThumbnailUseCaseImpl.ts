import { CognitoUser } from '../models/CognitoUser';
import { marketplaceUserRepository, tourPostRepository } from '../repositories';
import { UpdateThumbnailUseCase } from './interfaces/UpdateThumbnailUseCase';

export default class UpdateThumbnailUseCaseImpl implements UpdateThumbnailUseCase {
  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
    cdnUrl: string,
  ) => {
    // Check user exists
    const { tenant, username } = currentUser;
    const marketplaceUser = await marketplaceUserRepository.getById(`${tenant}#${username}`);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    const marketplaceUserId = marketplaceUser.id;
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    if (tourPost.authorId !== marketplaceUserId) {
      throw new Error('Only the owner of the tour post can update it');
    }

    await tourPostRepository.update(tourPostId, {
      thumbnail: cdnUrl,
    });
    // Delete Old thumbnail
    await tourPostRepository.deleteThumbnail(tourPost.thumbnail);
  };
}
