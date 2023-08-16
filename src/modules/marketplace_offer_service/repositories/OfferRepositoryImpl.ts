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
   * @param organizationId The ID of the organization
   * @param tourPostId - The ID of the post.
   * @returns A promise resolving to a array of Offer object.
   */
  async listByPost(organizationId: string, tourPostId: string): Promise<Offer[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organizationId}#${OFFER_INDEX}`,
        ':sk_filter_value': `${tourPostId}#`,
      },
    });
  }

  /**
   * Retrieves an offer by its ID and tour post ID.
   *
   * @param organizationId The ID of the organization
   * @param tourPostId - The ID of the post.
   * @param id - The ID of the offer.
   * @returns A Promise that resolves to the retrieved offer, or undefined if not found.
   */
  async get(
    organizationId: string,
    tourPostId: string,
    id: string,
  ): Promise<Offer | undefined> {
    return dynamoProvider.getItem<Offer>(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${ORGANIZATION_INDEX}#${organizationId}#${OFFER_INDEX}`,
      `${tourPostId}#${id}`,
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
      `${ORGANIZATION_INDEX}#${offer.organizationId}#${OFFER_INDEX}`,
      `${offer.tourPostId}#${offer.code}`,
      offer,
    );
    return offer;
  }

  /**
   * Updates an offer for the specified post.
   *
   * @param organizationId The ID of the organization
   * @param tourPostId The ID of the tour post
   * @param id - The ID of the offer to update.
   * @param offer - The partial offer object with the updated fields.
   * @returns A Promise that resolves to the updated rating.
   */
  async update(
    organizationId: string,
    tourPostId: string,
    id: string,
    offer: Partial<Offer>,
  ): Promise<Offer> {
    const result = await dynamoProvider.updateItemWithSetExpression(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${ORGANIZATION_INDEX}#${organizationId}#${OFFER_INDEX}`,
      `${tourPostId}#${id}`,
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
   * Retrieves a paginated list of offer send from a specific organization with all statuses.
   *
   * @param {string} organizationId - The ID of the organization for which to retrieve offers.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of offers or undefined if not found.
   */
  listOffersSendFromOrganization = async (
    organizationId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
  // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organizationId}#${OFFER_INDEX}`,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };

  /**
   * Retrieves a paginated list of offer send from a specific organization
   * and a specific status.
   *
   * @param {string} organizationId - The ID of the organization for which to retrieve offers.
   * @param {string} offerStatus - The status of the offer.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of offers or undefined if not found.
   */
  listOffersSendFromOrganizationByOfferStatus = async (
    organizationId: string,
    offerStatus: OfferStatus,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk AND lsi2 = :lsi2_filter_value',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organizationId}#${OFFER_INDEX}`,
        ':lsi2_filter_value': `${OFFER_INDEX}#${offerStatus}`,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };

  /**
   * Retrieves a paginated list of offer for a specific organization
   * and a specific author.
   *
   * @param {string} organizationId - The ID of the organization for which to retrieve offers.
   * @param {string} authorId - The ID of the author.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of offers or undefined if not found.
   */
  listByAuthor = async (
    organizationId: string,
    authorId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Prepare the query parameters
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND lsi1 = :lsi1_filter_value',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organizationId}#${OFFER_INDEX}`,
        ':lsi1_filter_value': authorId,
      },
    };

    // Perform the query using queryPagination and return the result
    return dynamoProvider.queryPagination(queryParams, paginationParams);
  };
}
