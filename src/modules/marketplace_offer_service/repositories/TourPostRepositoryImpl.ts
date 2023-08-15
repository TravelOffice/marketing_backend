import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { TourPost } from '../models/TourPost';
import { TourPostRepository } from './interfaces/TourPostRepository';
import { POST_INDEX } from '../utils/constants';

export default class TourPostRepositoryImpl implements TourPostRepository {
  /**
   * Retrieves a tour post by its ID.
   *
   * @param id - The ID of the tour post.
   * @returns A Promise that resolves to the retrieved tour post, or undefined if not found.
   */
  getById = async (id: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    return dynamoProvider.getItem<TourPost>(marketplaceTable, POST_INDEX, id);
  };
}
