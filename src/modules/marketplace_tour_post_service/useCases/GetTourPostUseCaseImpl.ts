import { helper } from 'core';
import { tourPostRepository } from '../repositories';
import { GetTourPostUseCase } from './interfaces/GetTourPostUseCase';
import { TourPost } from '../models/TourPost';
import { CognitoUser } from '../models/CognitoUser';

export default class GetTourPostUseCaseImpl implements GetTourPostUseCase {
  invoke = async (tourPostId: string, currentUser: CognitoUser) => {
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    const post = await tourPostRepository.getById(tourPostId, userId);
    if (!post) {
      throw new Error('Tour post not found');
    }
    return helper.excludeDataFromObject(post) as TourPost;
  };
}
