/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAwsSecretValue } from 'get-env';
import { helper, dynamoProvider, QueryInput } from 'core';

import {
  BOOKING_INDEX,
  CUSTOMER_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { BookingRepository } from './interfaces/BookingRepository';
import { Booking } from '../models/Booking';

export default class BookingRepositoryImpl implements BookingRepository {
  /**
   * Retrieves bookings associated with a specific customer.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} customerId - The ID of the customer.
   * @returns {Promise<Booking[]>} - A promise that resolves to an array of bookings.
   */
  getByCustomer = async (tenantId: string, customerId: string) => {
    // Build the query parameters to retrieve bookings by customer
    const queryParameters = {
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'), // Name of the DynamoDB table
      IndexName: 'Index5', // Name of the index to query
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi5, :lsi5)', // Key condition expression for the query
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${BOOKING_INDEX}`, // Value for the partition key
        ':lsi5': `${CUSTOMER_INDEX}#${customerId}`, // Value for the sort key prefix
      },
    };

    // Perform the query to retrieve the bookings
    return this.queryBooking(queryParameters);
  };

  private async queryBooking(input: QueryInput) {
    const items = await dynamoProvider.query(input);
    const bookings = items.map((item) => helper.excludeDataFromObject(item));
    return bookings as Booking[];
  }
}
