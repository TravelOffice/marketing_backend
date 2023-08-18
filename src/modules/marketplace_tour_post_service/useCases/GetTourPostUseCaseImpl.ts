import { helper } from 'core';
import { tourPostRepository } from '../repositories';
import { GetTourPostUseCase } from './interfaces/GetTourPostUseCase';
import { TourPost } from '../models/TourPost';

export default class GetTourPostUseCaseImpl implements GetTourPostUseCase {
  invoke = async (tourPostId: string) => {
    const post = await tourPostRepository.getById(tourPostId);
    if (!post) {
      throw new Error('Tour post not found');
    }
    return helper.excludeDataFromObject(post) as TourPost;
  };
}
