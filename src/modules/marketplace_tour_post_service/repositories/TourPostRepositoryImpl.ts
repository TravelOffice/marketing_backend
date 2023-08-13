import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { TourPost } from '../models/TourPost';
import { TourPostRepository } from './interfaces/TourPostRepository';
import {
  MARKETPLACE_COUNTER_INDEX,
  MARKETPLACE_USER_INDEX, POST_INDEX,
  TOUR_POST_BOOKMARK_INDEX,
  TOUR_POST_COUNTER_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { BookmarkedTourPost } from '../models/BookmarkedTourPost';

export default class TourPostRepositoryImpl implements TourPostRepository {
  /**
   * Lists all tour posts for the specified user.
   *
   * @param userId - The ID of the user.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * A promise resolving to a paginated response.
   */
  listByUser = async (userId: string, paginationParams: PaginationParams) => {
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk and lsi2 = :lsi2',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX,
        ':lsi2': userId,
      },
    };

    // Get list of tour posts by user
    // The data is paginated
    const queryResult = await dynamoProvider.queryPagination<TourPost>(
      queryParams,
      paginationParams,
    );

    // Transform the data such as:
    // - Add bookmarked flag to each post if the user has bookmarked it
    // - Add fav flag if the user has liked it
    const bookmarkedItems = await this.getAllBookmarkedItems(userId);
    const bookmarkedTourPostIds = bookmarkedItems.map((item) => item.tourPostId);
    if (queryResult) {
      const transformedPosts = queryResult.data.map((item) => ({
        ...item,
        isBookmarked: bookmarkedTourPostIds.includes(item.code),
      }));
      return {
        ...queryResult,
        data: transformedPosts,
      };
    }

    return queryResult;
  };

  /**
   * Lists all tour posts for the specified organization.
   * This method is used for organization admin to get all posts of the organization.
   * @param organizationId - The ID of the organization.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * A promise resolving to a paginated response.
   */
  listByOrganization = async (organizationId: string, paginationParams: PaginationParams) => {
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk and lsi1 = :lsi1',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX,
        ':lsi1': organizationId,
      },
    };

    // Get list of tour posts by user
    // The data is paginated
    return dynamoProvider.queryPagination(
      queryParams,
      paginationParams,
    );
  };

  /**
   * Retrieves a tour post by its ID and tenant ID.
   *
   * @param id - The ID of the tour post.
   * @returns A Promise that resolves to the retrieved tour post, or undefined if not found.
   */
  getById = async (id: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    return dynamoProvider.getItem<TourPost>(marketplaceTable, POST_INDEX, id);
  };

  /**
   * Creates a new tour post for the specified user.
   *
   * @param tourPost - The tour post object to create.
   * @returns A Promise that resolves to the created tour post.
   */
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

  /**
   * Updates a tour post for the specified user.
   *
   * @param id - The ID of the tour post to update.
   * @param tourPost - The partial tour post object with the updated fields.
   * @returns A Promise that resolves to the updated tour post.
   */
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
   * Lists all bookmarked items for the specified user.
   * Each bookmarked item only contains userId and tourPostId not the whole tour post.
   *
   * @param userId User id
   * @returns A Promise that resolves to the list of bookmarked items.
   */
  getAllBookmarkedItems = async (userId: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': `${MARKETPLACE_USER_INDEX}#${userId}`,
        ':sk_filter': TOUR_POST_BOOKMARK_INDEX,
      },
    };
    return dynamoProvider.query<BookmarkedTourPost>(queryParams);
  };

  /**
   * Retrieves a bookmarked item by its ID and tenant ID.
   * Bookmarked item only contains userId and tourPostId not the whole tour post.
   *
   * @param userId User id
   * @param tourPostId Tour post id
   * @returns A Promise that resolves to the retrieved bookmarked item, or undefined if not found.
   */
  getBookmarkedItem = async (userId: string, tourPostId: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    return dynamoProvider.getItem(
      marketplaceTable,
      `${MARKETPLACE_USER_INDEX}#${userId}`,
      `${TOUR_POST_BOOKMARK_INDEX}#${tourPostId}`,
    );
  };

  /**
   * Creates a new bookmarked item for the specified user.
   *
   * @param userId User id
   * @param tourPostId Tour post id
   * @returns A Promise that resolves to the created bookmarked item.
   */
  bookmark = async (userId: string, tourPostId: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const bookmarkedItem = {
      userId,
      tourPostId,
      createdAt: Date.now(),
    };
    await dynamoProvider.putItem(
      marketplaceTable,
      `${MARKETPLACE_USER_INDEX}#${userId}`,
      `${TOUR_POST_BOOKMARK_INDEX}#${tourPostId}`,
      bookmarkedItem,
    );
    return bookmarkedItem as Partial<BookmarkedTourPost>;
  };

  /**
   * Deletes a bookmarked item for the specified user.
   *
   * @param userId User id
   * @param tourPostId Tour post id
   */
  unbookmark = async (userId: string, tourPostId: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    await dynamoProvider.deleteItem(
      marketplaceTable,
      `${MARKETPLACE_USER_INDEX}#${userId}`,
      `${TOUR_POST_BOOKMARK_INDEX}#${tourPostId}`,
    );
  };

  /**
   * Method to generate tour post code which is user-readable
   * @returns A Promise that resolves to the generated code.
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
