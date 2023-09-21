import { dynamoProvider, helper, s3Provider } from 'core';
import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { BookmarkedTourPost } from '../models/BookmarkedTourPost';
import { FollowedTourPost } from '../models/FollowedTourPost';
import { TourPost } from '../models/TourPost';
import {
  MARKETPLACE_COUNTER_INDEX,
  MARKETPLACE_USER_INDEX,
  POST_INDEX,
  STATISTIC_INDEX,
  TOUR_POST_BOOKMARK_INDEX,
  TOUR_POST_COUNTER_INDEX,
  TOUR_POST_FOLLOW_INDEX,
  TOUR_POST_STATISTIC_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import {
  GetPostsByDepartureDateParams,
  GetPostsByEndingLocationParams,
  TourPostRepository,
} from './interfaces/TourPostRepository';
import { TourPostStatistic } from '../models/statistic/TourPostStatistic';
import { roundNumber } from '../utils/numeric';
import { TourPostType } from '../models/TourPostType';
import { TourPostStatus } from '../models/TourPostStatus';

type BookmarkOrFollowedTourPost = BookmarkedTourPost | FollowedTourPost;

const excludeKeys = [
  'pk',
  'sk',
  'lsi1',
  'lsi2',
  'lsi3',
  'lsi4',
  'lsi5',
  'linkedToTargetKeys',
] as (keyof TourPost)[];

export default class TourPostRepositoryImpl implements TourPostRepository {
  /**
   * Lists all tour posts sorted by createdAt
   * @param currentUserId - The ID of the user that own access token in the request.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * A promise resolving to a paginated response.
   * Each tour post will have additional data such as isBookmarked, isFav, etc.
   */
  list = async (
    currentUserId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined> => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX,
      },
    };
    const queryResult = await dynamoProvider.queryPagination<TourPost>(
      queryParams,
      paginationParams,
      excludeKeys,
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
   * List tour posts by a specific user.
   *
   * @param {string} currentUserId - The ID of the current user.
   * @param {string} author - The author's ID for whom tour posts are being listed.
   * @param {PaginationParams} paginationParams - The pagination parameters.
   * @param {TourPostStatus} [status] - Optional status to filter tour posts.
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * - A promise that resolves to the paginated list of tour posts or undefined if no data is found.
   */
  listByUser = async (
    currentUserId: string,
    author: string,
    paginationParams: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined> => {
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk and begins_with(lsi1, :lsi1_filter)',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX,
        ':lsi1_filter': status ? `${author}#${status}` : `${author}#`,
      },
    };

    // Get list of tour posts by user
    // The data is paginated
    const queryResult = await dynamoProvider.queryPagination<TourPost>(
      queryParams,
      paginationParams,
      excludeKeys,
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
   * List Tour Posts by Post Type and optional Status.
   *
   * @param {string} currentUserId - The ID of the current user.
   * @param {TourPostType} postType - The type of Tour Post to filter by.
   * @param {PaginationParams} paginationParams - Pagination parameters.
   * @param {TourPostStatus} [status] - Optional status filter.
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * - A promise that resolves to the list of Tour Posts or undefined.
   */
  listByPostType = async (
    currentUserId: string,
    postType: TourPostType,
    paginationParams: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined> => {
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');

    // Define query parameters for DynamoDB query
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk and begins_with(lsi3, :lsi3_filter)',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX, // Assuming POST_INDEX is a constant for the table index
        ':lsi3_filter': status ? `${postType}#${status}#` : `${postType}#`, // Construct filter based on status
      },
    };

    // Get list of tour posts by tour post type
    // The data is paginated
    const queryResult = await dynamoProvider.queryPagination<TourPost>(
      queryParams,
      paginationParams,
      excludeKeys,
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
   * @param {string} currentUserId - The ID of the current user
   * @param {string} organization - The ID of the organization.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @param {TourPostStatus} [status] - Optional status filter.
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * A promise resolving to a paginated response.
   */
  listByOrganization = async (
    currentUserId: string,
    organization: string,
    paginationParams: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined> => {
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk and begins_with(lsi2, :lsi2_filter)',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX,
        ':lsi2_filter': status ? `${organization}#${status}#` : `${organization}#`,
      },
    };

    // Get list of tour posts by user
    // The data is paginated
    const queryResult = await dynamoProvider.queryPagination<TourPost>(
      queryParams,
      paginationParams,
      excludeKeys,
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
   * List Tour Posts by post type, Departure Date and optional Status.
   * @param {GetPostsByDepartureDateParams} params
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * - A promise that resolves to the list of Tour Posts or undefined.
   */
  listByDepartureDate = async (
    params: GetPostsByDepartureDateParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined> => {
    const {
      currentUserId,
      departureDate,
      postType,
      paginationParams,
      status,
    } = params;
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');

    // Define query parameters for DynamoDB query
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index5',
      KeyConditionExpression: 'pk = :pk and begins_with(lsi5, :lsi5_filter)',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX, // Assuming POST_INDEX is a constant for the table index
        ':lsi5_filter': status ? `${postType}#${departureDate}#${status}#` : `${postType}#${departureDate}#`, // Construct filter based on status
      },
    };

    // Get list of tour posts by user
    // The data is paginated
    const queryResult = await dynamoProvider.queryPagination<TourPost>(
      queryParams,
      paginationParams,
      excludeKeys,
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
   * List Tour Posts by post type, Departure Date and optional Status.
   * @param {GetPostsByEndingLocationParams} params
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * - A promise that resolves to the list of Tour Posts or undefined.
   */
  listByEndingLocation = async (
    params: GetPostsByEndingLocationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined> => {
    console.log('Ending location');
    const {
      currentUserId,
      endingLocation,
      postType,
      paginationParams,
      status,
    } = params;
    // Prepare query params
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');

    // Define query parameters for DynamoDB query
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index4',
      KeyConditionExpression: 'pk = :pk and begins_with(lsi4, :lsi4_filter)',
      ExpressionAttributeValues: {
        ':pk': POST_INDEX, // Assuming POST_INDEX is a constant for the table index
        ':lsi4_filter': status ? `${postType}#${endingLocation}#${status}#` : `${postType}#${endingLocation}#`, // Construct filter based on status
      },
    };

    // Get list of tour posts by user
    // The data is paginated
    const queryResult = await dynamoProvider.queryPagination<TourPost>(
      queryParams,
      paginationParams,
      excludeKeys,
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
   * @param params - The pagination params
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * A promise resolving to a paginated response.
   */
  listBookmarkedByUser = async (
    userId: string,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined> => {
    // Query bookmarked items
    const queryResult = await this.getBookmarkedItemsWithPagination(userId, params);
    if (!queryResult) {
      logger.log(`No bookmarked tour post found for user ${userId}`);
      return undefined;
    }

    // Get tour posts from the bookmarked items
    const { data } = queryResult;
    const tourPosts = await this.batchQueryTourPosts(data);

    // Get all the bookmarked items and followed items of the user
    const followedItems = await this.getAllFollowedItems(userId);

    // Convert to array of tour post ids that are bookmarked or followed by the user
    const followedTourPostIds = followedItems.map((item) => item.tourPostId);

    // Get number of offers and rating average for each tour post
    const transformedTourPosts = await Promise.all(
      tourPosts.map(async (item: TourPost) => {
        const tourPostWithStatistic = await this.transformTourPostWithStatistic(item);
        return {
          ...tourPostWithStatistic,
          isFollowed: followedTourPostIds.includes(item.code),
          isBookmarked: true,
        };
      }),
    );

    return {
      ...queryResult,
      data: transformedTourPosts,
    };
  };

  /**
   * List followed tour posts of the specified user.
   * @param userId - The ID of the user.
   * @param params - The pagination params
   * @returns {Promise<PaginationResponsePayload<TourPost> | undefined>}
   * A promise resolving to a paginated response.
   */
  listFollowedByUser = async (
    userId: string,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined> => {
    // Query followed items
    const queryResult = await this.getFollowedItemsWithPagination(userId, params);
    if (!queryResult) {
      logger.log(`No followed tour post found for user ${userId}`);
      return undefined;
    }

    // Get tour posts from the followed items
    const { data } = queryResult;
    const tourPosts = await this.batchQueryTourPosts(data);

    // Get all the bookmarked items and followed items of the user
    const bookmarkedItems = await this.getAllBookmarkedItems(userId);

    // Convert to array of tour post ids that are bookmarked or followed by the user
    const bookmarkedTourPostIds = bookmarkedItems.map((item) => item.tourPostId);

    // Get number of offers and rating average for each tour post
    const transformedTourPosts = await Promise.all(
      tourPosts.map(async (item: TourPost) => {
        const tourPostWithStatistic = await this.transformTourPostWithStatistic(item);
        return {
          ...tourPostWithStatistic,
          isBookmarked: bookmarkedTourPostIds.includes(item.code),
          isFollowed: true,
        };
      }),
    );

    return {
      ...queryResult,
      data: transformedTourPosts,
    };
  };

  listByIds = async (ids: string[]) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const queryParams = {
      RequestItems: {
        [marketplaceTable]: {
          Keys: ids.map((id) => ({
            pk: POST_INDEX,
            sk: id,
          })),
        },
      },
    };
    const responses = await dynamoProvider.batchGetItems(queryParams);
    // Remove unnecessary data from the response
    return responses[marketplaceTable]
      .map((tourPost) => helper.excludeDataFromObject(tourPost) as TourPost);
  };

  /**
   * Get a TourPost by its ID and optionally transform it based on a user.
   *
   * @param {string} id - The ID of the TourPost to retrieve.
   * @param {string} [userId] - The ID of the user (optional) for transformation.
   * @returns {Promise<TourPost | undefined>}
   * - A promise that resolves with the TourPost (or undefined if not found).
   */
  getById = async (id: string, userId?: string): Promise<TourPost | undefined> => {
    // Retrieve the TourPost from the DynamoDB table
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    let tourPost = await dynamoProvider.getItem<TourPost>(marketplaceTable, POST_INDEX, id);

    // If the TourPost doesn't exist, return undefined
    if (!tourPost) {
      return undefined;
    }

    tourPost = helper.excludeDataFromObject(tourPost, excludeKeys) as TourPost;

    // If a user ID is provided, transform the TourPost with additional information
    if (userId) {
      return this.transformTourPost(tourPost, userId);
    }

    // Otherwise, return the original TourPost without transformation
    return tourPost;
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
   * Retrieves a bookmarked item by its ID.
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
   * Deletes a thumbnail image from an S3 bucket based on its CDN URL.
   *
   * @param {string} cdnUrl - The CDN URL of the thumbnail image to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is successful.
   * @throws {Error} If an error occurs during the deletion process.
   */
  deleteThumbnail = async (cdnUrl?: string): Promise<void> => {
    if (!cdnUrl) {
      // If CDN URL is not provided, nothing to delete
      return;
    }

    try {
      // Extract the key from the CDN URL
      const bucket = await getAwsSecretValue('MARKETPLACE_FILE_BUCKET');
      const cdnHostName = await getAwsSecretValue('MARKETPLACE_FILE_CDN');
      const key = cdnUrl.replace(`${cdnHostName}/`, '');

      // Delete the object from the S3 bucket
      await s3Provider.deleteObject(bucket, key);

      logger.log(`Deleted thumbnail: ${cdnUrl}`);
    } catch (error) {
      logger.log(`Error deleting thumbnail: ${error}`);
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

    // Get number of offers and rating average for each tour post
    const transformedTourPosts = await Promise.all(
      tourPosts.map(async (item) => {
        const tourPostWithStatistic = await this.transformTourPostWithStatistic(item);
        return {
          ...tourPostWithStatistic,
          isBookmarked: bookmarkedTourPostIds.includes(item.code),
          isFollowed: followedTourPostIds.includes(item.code),
        };
      }),
    );

    return transformedTourPosts;
  };

  /**
   * Transform a TourPost by adding additional information.
   *
   * @param {TourPost} tourPost - The TourPost to transform.
   * @param {string} userId - The ID of the user performing the transformation.
   * @returns {Promise<TourPost>} - A promise that resolves with the transformed TourPost.
   */
  private async transformTourPost(tourPost: TourPost, userId: string): Promise<TourPost> {
    // Get all the bookmarked items and followed items of the user
    const bookmarkedItem = await this.getBookmarkedItem(userId, tourPost.code);
    const followedItem = await this.getFollowedItem(userId, tourPost.code);

    const tourPostWithStatistic = await this.transformTourPostWithStatistic(tourPost);

    // Add isBookmarked and isFollowed flags to each tour post
    // as well as totalOffers and ratingAverage
    return {
      ...tourPostWithStatistic,
      isBookmarked: !!bookmarkedItem,
      isFollowed: !!followedItem,
    };
  }

  /**
   * Transform a TourPost by adding rating statistics.
   *
   * @param {TourPost} tourPost - The TourPost to transform.
   * @returns {Promise<TourPost>} - A promise that resolves with the transformed TourPost.
   */
  private async transformTourPostWithStatistic(tourPost: TourPost): Promise<TourPost> {
    // Get the number of offers and rating statistics for each tour post
    const statistic = await this.getTourStatistic(tourPost.code);
    const { totalOffers, totalRatings, numberOfRatings } = statistic;

    // Calculate the rating average, rounded to a reasonable precision
    let ratingAverage = 0;
    if (numberOfRatings > 0) {
      ratingAverage = roundNumber(totalRatings / numberOfRatings);
    }

    // Add totalOffers and ratingAverage to the TourPost
    return {
      ...tourPost,
      totalOffers,
      ratingAverage,
    };
  }

  /**
   * Method to get tour post statistic
   * @param tourPostId Tour post id
   * @returns A Promise that resolves to the tour post statistic.
   * The statistic contains number of offers and rating average.
   * If the tour post is not found, it will return undefined.
   */
  private getTourStatistic = async (tourPostId: string) => {
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const tourPostStatistic = await dynamoProvider.getItem<TourPostStatistic>(
      statisticTable,
      STATISTIC_INDEX,
      `${TOUR_POST_STATISTIC_INDEX}#${tourPostId}`,
    );
    if (!tourPostStatistic) {
      return {
        totalOffers: 0,
        totalRatings: 0,
        numberOfRatings: 0,
      };
    }
    return tourPostStatistic;
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
    return dynamoProvider.queryPagination<BookmarkedTourPost>(
      queryParams,
      paginationParams,
    );
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
    return dynamoProvider.queryPagination<FollowedTourPost>(
      queryParams,
      paginationParams,
    );
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
    return responses[marketplaceTable]
      .map((tourPost) => helper.excludeDataFromObject(tourPost) as TourPost);
  };
}
