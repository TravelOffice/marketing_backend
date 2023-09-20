import { tourPostRepository } from '../repositories';
import { GetTourPostUseCase } from './interfaces/GetTourPostUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class GetTourPostUseCaseImpl implements GetTourPostUseCase {
  invoke = async (tourPostId: string, currentUser: CognitoUser) => {
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    const post = await tourPostRepository.getById(tourPostId, userId);
    if (!post) {
      throw new Error('Tour post not found');
    }
    return post;
  };
}
