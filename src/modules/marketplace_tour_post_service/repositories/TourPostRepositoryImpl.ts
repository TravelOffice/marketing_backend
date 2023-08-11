import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import { TourPost } from '../models/TourPost';
import { TourPostRepository } from './interfaces/TourPostRepository';
import { MARKETPLACE_COUNTER_INDEX, POST_INDEX, TOUR_POST_COUNTER_INDEX } from '../utils/constants';
import logger from '../utils/logger';

export default class TourPostRepositoryImpl implements TourPostRepository {
  list(nextToken?: string, limit?: number): Promise<TourPost[]> {
    console.log(nextToken, limit);
    throw new Error('Method not implemented');
  }

  getById = async (id: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    return dynamoProvider.getItem<TourPost>(marketplaceTable, POST_INDEX, id);
  };

  create = async (tourPost: TourPost) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    await dynamoProvider.putItem(
      marketplaceTable,
      POST_INDEX,
      tourPost.code,
      tourPost,
    );
    return tourPost;
  };

  update = async (id: string, tourPost: Partial<TourPost>) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const result = await dynamoProvider.updateItemWithSetExpression(
      marketplaceTable,
      POST_INDEX,
      id,
      tourPost,
    );
    return result.Attributes as TourPost;
  };

  /**
   * Method to generate tour post code which is user-readable
   */
  generateCode = async () => {
    try {
      const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
      const count = await helper.generateCode(
        table,
        MARKETPLACE_COUNTER_INDEX,
        TOUR_POST_COUNTER_INDEX,
      );
      return count.toString();
    } catch (error) {
      logger.log('Error during increment operation for tour post');
      throw error;
    }
  };
}
