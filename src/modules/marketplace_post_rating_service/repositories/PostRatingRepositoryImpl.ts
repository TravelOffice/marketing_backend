import { dynamoProvider, helper, logger } from 'core';
import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { PostRating } from '../models/PostRating';
import { PostRatingRepository } from './interfaces/PostRatingRepository';
import {
  MARKETPLACE_COUNTER_INDEX, ORGANIZATION_INDEX, RATING_COUNTER_INDEX, RATING_INDEX,
} from '../utils/constants';

export default class PostRatingRepositoryImpl implements PostRatingRepository {
  /**
   * Lists all ratings for the specified tour post.
   *
   * @param organizationId The ID of the organization
   * @param tourPostId - The ID of the post.
   * @returns A promise resolving to a array of PostRating object.
   */
  async listByPost(organizationId: string, tourPostId: string): Promise<PostRating[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organizationId}#${RATING_INDEX}`,
        ':sk_filter_value': `${tourPostId}#`,
      },
    });
  }

  /**
   * Retrieves a rating by its ID and tour post ID.
   *
   * @param organizationId The ID of the organization
   * @param tourPostId - The ID of the post.
   * @param id - The ID of the rating.
   * @returns A Promise that resolves to the retrieved rating, or undefined if not found.
   */
  async get(
    organizationId: string,
    tourPostId: string,
    id: string,
  ): Promise<PostRating | undefined> {
    return dynamoProvider.getItem<PostRating>(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${ORGANIZATION_INDEX}#${organizationId}#${RATING_INDEX}`,
      `${tourPostId}#${id}`,
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
      `${ORGANIZATION_INDEX}#${rating.organizationId}#${RATING_INDEX}`,
      `${rating.tourPostId}#${rating.code}`,
      rating,
    );
    return rating;
  }

  /**
   * Updates a rating for the specified post.
   *
   * @param organizationId The ID of the organization
   * @param tourPostId The ID of the tour post
   * @param id - The ID of the rating to update.
   * @param rating - The partial rating object with the updated fields.
   * @returns A Promise that resolves to the updated rating.
   */
  async update(
    organizationId: string,
    tourPostId: string,
    id: string,
    rating: Partial<PostRating>,
  ): Promise<PostRating> {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(rating);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      Key: {
        pk: `${ORGANIZATION_INDEX}#${organizationId}#${RATING_INDEX}`,
        sk: `${tourPostId}#${id}`,
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
   * @param organizationId The ID of organization
   * @param tourPostId The ID of tourPosId
   * @param id - The ID of the rating to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async delete(organizationId: string, tourPostId: string, id: string): Promise<void> {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${ORGANIZATION_INDEX}#${organizationId}#${RATING_INDEX}`,
      `${tourPostId}#${id}`,
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

  /**
   * Retrieves a paginated list of post ratings for a specific organization
   * and a specific number of stars.
   *
   * @param {string} organizationId - The ID of the organization for which to retrieve ratings.
   * @param {string} numberStar - The number of stars for which to retrieve ratings.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<PostRating> | undefined>}
   * - A promise resolving to the paginated list of post ratings or undefined if not found.
   */
  listByOrganization = async (
    organizationId: string,
    numberStar: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<PostRating> | undefined> => {
  // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk AND lsi2 = :lsi2_filter_value',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organizationId}#${RATING_INDEX}`,
        ':lsi2_filter_value': `${RATING_INDEX}#${numberStar}`,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };
}
