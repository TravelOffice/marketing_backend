import { tourPostRepository } from '../repositories';
import { GetTourPostUseCase } from './interfaces/GetTourPostUseCase';

export default class GetTourPostUseCaseImpl implements GetTourPostUseCase {
  invoke = async (tourPostId: string) => {
    const post = await tourPostRepository.getById(tourPostId);
    if (!post) {
      throw new Error('Tour post not found');
    }
    return post;
  };
}
