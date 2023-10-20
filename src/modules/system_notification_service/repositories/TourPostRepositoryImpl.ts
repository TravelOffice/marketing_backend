import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { POST_INDEX } from '../utils/constants';
import { TourPostRepository } from './interfaces/TourPostRepository';
import { TourPost } from '../models/TourPost/TourPost';

export default class TourPostRepositoryImpl implements TourPostRepository {
  /**
   * Get a TourPost by its ID and optionally transform it based on a user.
   *
   * @param {string} id - The ID of the TourPost to retrieve.
   * @returns {Promise<TourPost | undefined>}
   * - A promise that resolves with the TourPost (or undefined if not found).
   */
  getById = async (id: string): Promise<TourPost | undefined> => {
    // Retrieve the TourPost from the DynamoDB table
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    return dynamoProvider.getItem<TourPost>(marketplaceTable, POST_INDEX, id);
  };
}
