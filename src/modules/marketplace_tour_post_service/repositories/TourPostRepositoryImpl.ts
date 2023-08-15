import { dynamoProvider, helper } from 'core';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { BookmarkedTourPost } from '../models/BookmarkedTourPost';
import { FollowedTourPost } from '../models/FollowedTourPost';
import { TourPost } from '../models/TourPost';
import {
  MARKETPLACE_COUNTER_INDEX,
  MARKETPLACE_USER_INDEX, POST_INDEX,
  TOUR_POST_BOOKMARK_INDEX,
  TOUR_POST_COUNTER_INDEX,
  TOUR_POST_FOLLOW_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { TourPostRepository } from './interfaces/TourPostRepository';

type BookmarkOrFollowedTourPost = BookmarkedTourPost | FollowedTourPost;

export default class TourPostRepositoryImpl implements TourPostRepository {
  /**
   * Lists all tour posts
   * @param currentUserId - The ID of the user that own access token in the request.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * A promise resolving to a paginated response.
   * Each tour post will have additional data such as isBookmarked, isFav, etc.
   */
  list = async (currentUserId: string, paginationParams: PaginationParams) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX,
      },
    };
    const queryResult = await dynamoProvider.queryPagination<TourPost>(
      queryParams,
      paginationParams,
    );

    // Transform the data such as:
    // - Add bookmarked flag to each post if the user has bookmarked it
    // - Add fav flag if the user has liked it
    if (queryResult) {
      const transformedPosts = await this.transformTourPostList(queryResult.data, currentUserId);
      return {
        ...queryResult,
        data: transformedPosts,
      };
    }

    return queryResult;
  };

  /**
   * Lists all tour posts for the specified user.
   *
   * @param byUserId - The ID of the user.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * A promise resolving to a paginated response.
   */
  listByUser = async (
    currentUserId: string,
    author: string,
    paginationParams: PaginationParams,
  ) => {
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk and lsi1 = :lsi1',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX,
        ':lsi1': author,
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
    if (queryResult) {
      const transformedPosts = await this.transformTourPostList(queryResult.data, currentUserId);
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
  listByOrganization = async (
    currentUserId: string,
    organizationId: string,
    paginationParams: PaginationParams,
  ) => {
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk and begins_with(lsi1, :lsi1_filter)',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX,
        ':lsi1_filter': `${organizationId}#`,
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
    if (queryResult) {
      const transformedPosts = await this.transformTourPostList(queryResult.data, currentUserId);
      return {
        ...queryResult,
        data: transformedPosts,
      };
    }

    return queryResult;
  };

  /**
   * List bookmarked tour posts of the specified user.
   * @param userId - The ID of the user.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<BookmarkedTourPost> | undefined>}
   * A promise resolving to a paginated response.
   */
  listBookmarkedByUser = async (
    userId: string,
    params: PaginationParams,
  ) => {
    // Query bookmarked items
    const queryResult = await this.getBookmarkedItemsWithPagination(userId, params);
    if (!queryResult) {
      logger.log(`No bookmarked tour post found for user ${userId}`);
      return undefined;
    }

    // Get tour posts from the bookmarked items
    const { data } = queryResult;
    const tourPosts = await this.batchQueryTourPosts(data);

    return {
      ...queryResult,
      data: tourPosts,
    };
  };

  /**
   * List followed tour posts of the specified user.
   * @param userId - The ID of the user.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<FollowedTourPost> | undefined>}
   * A promise resolving to a paginated response.
   */
  listFollowedByUser = async (
    userId: string,
    params: PaginationParams,
  ) => {
    // Query followed items
    const queryResult = await this.getFollowedItemsWithPagination(userId, params);
    if (!queryResult) {
      logger.log(`No followed tour post found for user ${userId}`);
      return undefined;
    }

    // Get tour posts from the followed items
    const { data } = queryResult;
    const tourPosts = await this.batchQueryTourPosts(data);

    return {
      ...queryResult,
      data: tourPosts,
    };
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
   * Lists all followed items for the specified user.
   * Each followed item only contains userId and tourPostId not the whole tour post.
   *
   * @param userId User id
   * @returns A Promise that resolves to the list of followed items.
   */
  getAllFollowedItems = async (userId: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': `${MARKETPLACE_USER_INDEX}#${userId}`,
        ':sk_filter': TOUR_POST_FOLLOW_INDEX,
      },
    };
    return dynamoProvider.query<FollowedTourPost>(queryParams);
  };

  /**
   * Retrieves a followed item by its ID and tenant ID.
   * Followed item only contains userId and tourPostId not the whole tour post.
   *
   * @param userId User id
   * @param tourPostId Tour post id
   * @returns A Promise that resolves to the retrieved followed item, or undefined if not found.
   */
  getFollowedItem = async (userId: string, tourPostId: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    return dynamoProvider.getItem(
      marketplaceTable,
      `${MARKETPLACE_USER_INDEX}#${userId}`,
      `${TOUR_POST_FOLLOW_INDEX}#${tourPostId}`,
    );
  };

  /**
   * Creates a new followed item for the specified user.
   *
   * @param userId User id
   * @param tourPostId Tour post id
   * @returns A Promise that resolves to the created followed item.
   */
  follow = async (userId: string, tourPostId: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const followedItem = {
      userId,
      tourPostId,
      createdAt: Date.now(),
    };
    await dynamoProvider.putItem(
      marketplaceTable,
      `${MARKETPLACE_USER_INDEX}#${userId}`,
      `${TOUR_POST_FOLLOW_INDEX}#${tourPostId}`,
      followedItem,
    );
    return followedItem as Partial<FollowedTourPost>;
  };

  /**
   * Deletes a followed item for the specified user.
   *
   * @param userId User id
   * @param tourPostId Tour post id
   */
  unfollow = async (userId: string, tourPostId: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    await dynamoProvider.deleteItem(
      marketplaceTable,
      `${MARKETPLACE_USER_INDEX}#${userId}`,
      `${TOUR_POST_FOLLOW_INDEX}#${tourPostId}`,
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

  /**
   * Method to transform tour post list
   *
   * @param tourPosts List of tour posts
   * @param userId User id
   * @returns A Promise that resolves to the transformed tour post list.
   * Each tour post will have additional data such as isBookmarked, isFav, etc.
   */
  private transformTourPostList = async (tourPosts: Array<TourPost>, userId: string) => {
    // Get all the bookmarked items and followed items of the user
    const bookmarkedItems = await this.getAllBookmarkedItems(userId);
    const followedItems = await this.getAllFollowedItems(userId);

    // Convert to array of tour post ids that are bookmarked or followed by the user
    const bookmarkedTourPostIds = bookmarkedItems.map((item) => item.tourPostId);
    const followedTourPostIds = followedItems.map((item) => item.tourPostId);

    // Add isBookmarked and isFollowed flags to each tour post
    return tourPosts.map((item) => ({
      ...item,
      isBookmarked: bookmarkedTourPostIds.includes(item.code),
      isFollowed: followedTourPostIds.includes(item.code),
    }));
  };

  /**
   * Get bookmarked items with pagination
   * @param userId User id
   * @param paginationParams Pagination params
   * @returns A Promise that resolves to the list of bookmarked items.
   */
  private getBookmarkedItemsWithPagination = async (
    userId: string,
    paginationParams: PaginationParams,
  ) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': `${MARKETPLACE_USER_INDEX}#${userId}`,
        ':sk_filter': TOUR_POST_BOOKMARK_INDEX,
      },
    };
    const queryResult = await dynamoProvider.queryPagination<BookmarkedTourPost>(
      queryParams,
      paginationParams,
    );

    return queryResult;
  };

  /**
   * Get followed items with pagination
   * @param userId User id
   * @param paginationParams Pagination params
   * @returns A Promise that resolves to the list of followed items.
   */
  private getFollowedItemsWithPagination = async (
    userId: string,
    paginationParams: PaginationParams,
  ) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': `${MARKETPLACE_USER_INDEX}#${userId}`,
        ':sk_filter': TOUR_POST_FOLLOW_INDEX,
      },
    };
    const queryResult = await dynamoProvider.queryPagination<FollowedTourPost>(
      queryParams,
      paginationParams,
    );

    return queryResult;
  };

  /**
   * Batch query tour posts from bookmarked / followed items
   * @param bookmarkOrFollowedItems List of bookmarked / followed items
   * @returns A Promise that resolves to the list of tour posts.
   */
  private batchQueryTourPosts = async (bookmarkOrFollowedItems: BookmarkOrFollowedTourPost[]) => {
    if (bookmarkOrFollowedItems.length === 0) {
      // Return immediately if there is no bookmarked or followed item
      return [];
    }
    // Batch query tour posts
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      RequestItems: {
        [marketplaceTable]: {
          Keys: bookmarkOrFollowedItems.map((item) => ({
            pk: POST_INDEX,
            sk: item.tourPostId,
          })),
        },
      },
    };
    const responses = await dynamoProvider.batchGetItems(queryParams);

    // Remove unnecessary data from the response
    const tourPosts = responses[marketplaceTable]
      .map((tourPost) => helper.excludeDataFromObject(tourPost) as TourPost);

    return tourPosts;
  };
}
