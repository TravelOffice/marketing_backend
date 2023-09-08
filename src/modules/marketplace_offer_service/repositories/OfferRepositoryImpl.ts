import { dynamoProvider, helper, logger } from 'core';
import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { MARKETPLACE_COUNTER_INDEX, OFFER_COUNTER_INDEX, OFFER_INDEX } from '../utils/constants';
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
      {
        ...offer,
        ...this.generateLSI(offer),
      },
    );
    return offer;
  }

  /**
   * Updates an offer for the specified post.
   *
   * @param id - The ID of the offer to update.
   * @param offer - The partial offer object with the updated fields.
   * @param status - The new status of offer (optional)
   * @returns A Promise that resolves to the updated rating.
   */
  async update(
    id: string,
    offer: Partial<Offer>,
    status?: OfferStatus,
  ): Promise<Offer> {
    let updatingOffer = offer;
    if (status) {
      updatingOffer = {
        ...offer,
        ...this.generateLSI(offer),
      };
    }
    const result = await dynamoProvider.updateItemWithSetExpression(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      OFFER_INDEX,
      id,
      updatingOffer,
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
   * @param  - The status of the organization for which to retrieve offers (optional)
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of sent offers or undefined if not found.
   */
  listSentOffersOfOrganization = async (
    organization: string,
    paginationParams: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': `${organization}#${status ?? ''}`,
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
   * @param status - The status of the organization for which to retrieve offers.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of received offers or undefined if not found.
   */
  listReceivedOffersOfOrganization = async (
    organization: string,
    paginationParams: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index4',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi4, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': `${organization}#${status ?? ''}`,
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
   * @param status - The status of the organization for which to retrieve offers.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of offers or undefined if not found.
   */
  listSentOffersOfUser = async (
    userId: string,
    paginationParams: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi2, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': `${userId}#${status ?? ''}`,
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
   * @param status - The status of the organization for which to retrieve offers.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of offers or undefined if not found.
   */
  listReceivedOffersOfUser = async (
    userId: string,
    paginationParams: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index5',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi5, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': `${userId}#${status ?? ''}`,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };

  private generateLSI(offer: Partial<Offer>) {
    const {
      sentOrg, authorId, tourPostId, receivedOrg, receivedUser, offerStatus, createdAt,
    } = offer;
    return {
      lsi1: `${sentOrg}#${offerStatus}#${createdAt}`, // Get all sent offers of the organization
      lsi2: `${authorId}#${offerStatus}#${createdAt}`, // Get all sent offers of the user
      lsi3: `${tourPostId}#${offerStatus}#${createdAt}`, // Get all offers of the post
      lsi4: `${receivedOrg}#${offerStatus}#${createdAt}`, // Get all received offers by organization
      lsi5: `${receivedUser}#${offerStatus}#${createdAt}`, // Get all received offers by user
    };
  }
}
