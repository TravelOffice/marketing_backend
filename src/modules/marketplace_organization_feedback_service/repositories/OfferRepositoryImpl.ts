import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { OFFER_INDEX } from '../utils/constants';
import { OfferRepository } from './interfaces/OfferRepository';
import { Offer, OfferStatus } from '../models/Offer';

export default class OfferRepositoryImpl implements OfferRepository {
  /**
   * List all successful offers for a specific tour post and author.
   *
   * @param {string} organization - The ID of the organization.
   * @param {string} author - The author's ID.
   * @returns {Promise<Offer[]>} - A promise that resolves with an array of successful offers.
   */
  async listSuccessOfferByOrgAndAuthor(organization: string, author: string): Promise<Offer[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi2, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': `${author}#`, // Filter by tour post ID
        ':org_filter_value': organization,
        ':status_filter_value': OfferStatus.ACCEPTED,
      },
      FilterExpression: 'receivedOrg = :org_filter_value AND offerStatus = :status_filter_value',
    });
  }
}
