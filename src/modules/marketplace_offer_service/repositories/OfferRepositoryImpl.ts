import { dynamoProvider, helper, logger } from 'core';
import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import {
  MARKETPLACE_COUNTER_INDEX, OFFER_COUNTER_INDEX, OFFER_INDEX, ORGANIZATION_INDEX,
} from '../utils/constants';
import { OfferRepository } from './interfaces/OfferRepository';
import { Offer, OfferStatus } from '../models/Offer';

export default class OfferRepositoryImpl implements OfferRepository {
  /**
   * Lists all offers for the specified tour post.
   *
   * @param tourPostId - The ID of the post.
   * @returns A promise resolving to a array of Offer object.
   */
  async listByPost(tourPostId: string): Promise<Offer[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi3, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': `${tourPostId}#`,
      },
    });
  }

  /**
   * Retrieves an offer by its ID.
   *
   * @param id - The ID of the offer.
   * @returns A Promise that resolves to the retrieved offer, or undefined if not found.
   */
  async get(id: string): Promise<Offer | undefined> {
    return dynamoProvider.getItem<Offer>(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      OFFER_INDEX,
      id,
    );
  }

  /**
   * Create a new offer for the specified post.
   *
   * @param offer - The rating object to create.
   * @returns A Promise that resolves to the created rating.
   */
  async create(offer: Offer): Promise<Offer> {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      OFFER_INDEX,
      offer.code,
      offer,
    );
    return offer;
  }

  /**
   * Updates an offer for the specified post.
   *
   * @param id - The ID of the offer to update.
   * @param offer - The partial offer object with the updated fields.
   * @returns A Promise that resolves to the updated rating.
   */
  async update(
    id: string,
    offer: Partial<Offer>,
  ): Promise<Offer> {
    const result = await dynamoProvider.updateItemWithSetExpression(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      OFFER_INDEX,
      id,
      offer,
    );
    return result.Attributes as Offer;
  }

  /**
   * Method to generate offer code which is user-readable
   */
  generateCode = async () => {
    try {
      const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
      const count = await helper.generateCode(
        table,
        MARKETPLACE_COUNTER_INDEX,
        OFFER_COUNTER_INDEX,
      );
      return count.toString();
    } catch (error) {
      logger.log('Error during increment operation for offer');
      throw error;
    }
  };

  /**
   * Retrieves a paginated list of sent offers of a specific organization with all statuses.
   *
   * @param {string} organization - The ID of the organization for which to retrieve offers.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of sent offers or undefined if not found.
   */
  listSentOffersOfOrganization = async (
    organization: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': organization,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };

  /**
   * Retrieves a paginated list of sent offers of a specific organization
   * and a specific status.
   *
   * @param {string} organization - The ID of the organization for which to retrieve offers.
   * @param {string} offerStatus - The status of the offer.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of sent offers or undefined if not found.
   */
  listSentOffersOfOrganizationByOfferStatus = async (
    organization: string,
    offerStatus: OfferStatus,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk AND lsi2 = :lsi2_filter_value',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organization}#${OFFER_INDEX}`,
        ':lsi2_filter_value': `${OFFER_INDEX}#${offerStatus}`,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };

  /**
   * Retrieves a paginated list of received offers of a specific organization.
   *
   * @param {string} organization - The ID of the organization for which to retrieve offers.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of received offers or undefined if not found.
   */
  listReceivedOffersOfOrganization = async (
    organization: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index4',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi4, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': `${organization}#`,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };

  /**
   * Retrieves a paginated list of sent offer for a specific user
   *
   * @param {string} userId - The ID of the user.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of offers or undefined if not found.
   */
  listSentOffersOfUser = async (
    userId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi2, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': userId,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };

  /**
   * Retrieves a paginated list of received offer for a specific user
   *
   * @param {string} userId - The ID of the user.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of offers or undefined if not found.
   */
  listReceivedOffersOfUser = async (
    userId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index5',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi5, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': userId,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };
}
