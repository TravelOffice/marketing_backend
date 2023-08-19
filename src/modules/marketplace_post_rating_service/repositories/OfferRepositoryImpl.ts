import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { OFFER_INDEX } from '../utils/constants';
import { OfferRepository } from './interfaces/OfferRepository';
import { Offer, OfferStatus } from '../models/Offer';

export default class OfferRepositoryImpl implements OfferRepository {
  /**
   * List all successful offers for a specific tour post and author.
   *
   * @param {string} tourPostId - The ID of the tour post.
   * @param {string} author - The author's ID.
   * @returns {Promise<Offer[]>} - A promise that resolves with an array of successful offers.
   */
  async listSuccessOfferByPostAndAuthor(tourPostId: string, author: string): Promise<Offer[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi3, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': OFFER_INDEX,
        ':lsi_filter_value': `${tourPostId}#`, // Filter by tour post ID
        ':author_filter_value': author,
        ':status_filter_value': OfferStatus.ACCEPTED,
      },
      FilterExpression: 'authorId = :author_filter_value AND offerStatus = :status_filter_value',
    });
  }
}
