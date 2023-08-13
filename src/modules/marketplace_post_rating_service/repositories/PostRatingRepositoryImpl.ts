import { dynamoProvider, helper, logger } from 'core';
import { getAwsSecretValue } from 'get-env';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { PostRating, PostRatingResponsePayload } from '../models/PostRating';
import { PostRatingRepository } from './interfaces/PostRatingRepository';
import {
  MARKETPLACE_COUNTER_INDEX, POST_INDEX, RATING_COUNTER_INDEX, RATING_INDEX,
} from '../utils/constants';

export default class PostRatingRepositoryImpl implements PostRatingRepository {
  /**
   * Lists all ratings for the specified tour post.
   *
   * @param tourPostId - The ID of the post.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PostRatingResponsePayload>} - A promise resolving to a paginated response.
   */
  async listByPost(
    tourPostId: string,
    paginationParams: PaginationParams,
  ): Promise<PostRatingResponsePayload | undefined> {
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${POST_INDEX}#${tourPostId}#${RATING_INDEX}`,
      },
    };
    return dynamoProvider.queryPagination(
      queryParams,
      paginationParams,
    );
  }

  /**
   * Retrieves a rating by its ID and tour post ID.
   *
   * @param tourPostId - The ID of the post.
   * @param id - The ID of the rating.
   * @returns A Promise that resolves to the retrieved rating, or undefined if not found.
   */
  async get(tourPostId: string, id: string): Promise<PostRating | undefined> {
    return dynamoProvider.getItem<PostRating>(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${POST_INDEX}#${tourPostId}#${RATING_INDEX}`,
      id,
    );
  }

  /**
   * Creates a new rating for the specified post.
   *
   * @param rating - The rating object to create.
   * @returns A Promise that resolves to the created rating.
   */
  async create(rating: PostRating): Promise<PostRating> {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${POST_INDEX}#${rating.tourPostId}#${RATING_INDEX}`,
      `${rating.code}`,
      rating,
    );
    return rating;
  }

  /**
   * Updates a rating for the specified post.
   *
   * @param tourPostId The ID of the tour post
   * @param id - The ID of the rating to update.
   * @param rating - The partial rating object with the updated fields.
   * @returns A Promise that resolves to the updated rating.
   */
  async update(
    tourPostId: string,
    id: string,
    rating: Partial<PostRating>,
  ): Promise<PostRating> {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(rating);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      Key: {
        pk: `${POST_INDEX}#${tourPostId}#${RATING_INDEX}`,
        sk: `${id}`,
      },
      UpdateExpression: helper.generateUpdateExpression(rating),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });
    return result.Attributes as PostRating;
  }

  /**
   * Deletes a rating for the specified tour post.
   *
   * @param tourPostId
   * @param id - The ID of the rating to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async delete(tourPostId: string, id: string): Promise<void> {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${POST_INDEX}#${tourPostId}#${RATING_INDEX}`,
      `${id}`,
    );
  }

  /**
   * Method to generate post rating code which is user-readable
   */
  generateCode = async () => {
    try {
      const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
      const count = await helper.generateCode(
        table,
        MARKETPLACE_COUNTER_INDEX,
        RATING_COUNTER_INDEX,
      );
      return count.toString();
    } catch (error) {
      logger.log('Error during increment operation for post rating');
      throw error;
    }
  };
}
