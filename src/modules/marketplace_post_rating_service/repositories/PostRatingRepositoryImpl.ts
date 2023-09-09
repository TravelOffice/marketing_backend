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
   * @param organization The ID of the organization
   * @param tourPostId - The ID of the post.
   * @returns A promise resolving to a array of PostRating object.
   */
  async listByPost(organization: string, tourPostId: string): Promise<PostRating[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organization}#${RATING_INDEX}`,
        ':sk_filter_value': `${tourPostId}#`,
      },
    });
  }

  /**
   * Retrieves a rating by its ID and tour post ID.
   *
   * @param organization The ID of the organization
   * @param tourPostId - The ID of the post.
   * @param id - The ID of the rating.
   * @returns A Promise that resolves to the retrieved rating, or undefined if not found.
   */
  async get(
    organization: string,
    tourPostId: string,
    id: string,
  ): Promise<PostRating | undefined> {
    return dynamoProvider.getItem<PostRating>(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${ORGANIZATION_INDEX}#${organization}#${RATING_INDEX}`,
      `${tourPostId}#${id}`,
    );
  }

  /**
   * Get a PostRating by organization, tourPostId, and userId.
   *
   * @param {string} organization - The organization identifier.
   * @param {string} tourPostId - The tour post identifier.
   * @param {string} userId - The user identifier.
   * @returns {Promise<PostRating | undefined>}
   * - A promise that resolves with the retrieved PostRating or undefined if not found.
   */
  async getByUserId(
    organization: string,
    tourPostId: string,
    userId: string,
  ): Promise<PostRating | undefined> {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');

    // Define the query parameters
    const queryParams = {
      TableName: marketplaceTable,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organization}#${RATING_INDEX}`,
        ':sk_filter': `${tourPostId}#`,
        ':user_filter': userId,
      },
      FilterExpression: 'authorId = :user_filter',
    };

    // Execute the query
    const result = await dynamoProvider.query(queryParams);

    // Extract the first matching PostRating (if any)
    const [postRating] = result as PostRating[];

    return postRating; // Return the retrieved PostRating or undefined if not found
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
      `${ORGANIZATION_INDEX}#${rating.organization}#${RATING_INDEX}`,
      `${rating.tourPostId}#${rating.code}`,
      rating,
    );
    return rating;
  }

  /**
   * Updates a rating for the specified post.
   *
   * @param organization The ID of the organization
   * @param tourPostId The ID of the tour post
   * @param id - The ID of the rating to update.
   * @param rating - The partial rating object with the updated fields.
   * @returns A Promise that resolves to the updated rating.
   */
  async update(
    organization: string,
    tourPostId: string,
    id: string,
    rating: Partial<PostRating>,
  ): Promise<PostRating> {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(rating);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      Key: {
        pk: `${ORGANIZATION_INDEX}#${organization}#${RATING_INDEX}`,
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
   * @param organization The ID of organization
   * @param tourPostId The ID of tourPosId
   * @param id - The ID of the rating to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async delete(organization: string, tourPostId: string, id: string): Promise<void> {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${ORGANIZATION_INDEX}#${organization}#${RATING_INDEX}`,
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
   * List post ratings for a specific organization, potentially filtered by star rating.
   *
   * @param {string} organization - The ID of the organization.
   * @param {PaginationParams} paginationParams - Parameters for pagination.
   * @param {string} numberStar - Optional. The star rating to filter by.
   * @returns {Promise<PaginationResponsePayload<PostRating> | undefined>}
   * - A promise that resolves with the paginated list of post ratings or undefined.
   */
  listByOrganization = async (
    organization: string,
    paginationParams: PaginationParams,
    numberStar?: string,
  ): Promise<PaginationResponsePayload<PostRating> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi2, :lsi2_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organization}#${RATING_INDEX}`,
        ':lsi2_filter_value': numberStar ? `${RATING_INDEX}#${numberStar}` : RATING_INDEX,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };
}
