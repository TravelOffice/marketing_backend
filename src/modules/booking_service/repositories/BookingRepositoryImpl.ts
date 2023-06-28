import { getAwsSecretValue } from 'get-env';
import { QueryInput, dynamoProvider, helper } from 'core';
import { Booking } from '../models/booking/Booking';
import {
  BOOKING_COUNTER_INDEX,
  BOOKING_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { BookingRepository } from './interfaces/BookingRepository';
import logger from '../utils/logger';

export default class BookingRepositoryImpl implements BookingRepository {
  /**
   * Create new direct booking
   * @param tenant Tenant id
   * @param booking Booking information
   * @returns Created booking
   */
  create = async (tenant: string, booking: Booking) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.putItem(
      table,
      `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`,
      booking.code,
      booking,
    );
    logger.log(`Created new booking for tenant ${tenant}`);
    return booking;
  };

  createFromLead = async (tenant: string, leadId: string, booking: Booking) => {
    logger.log(`Creating new booking from lead tenant ${tenant} leadId ${leadId} booking ${JSON.stringify(booking)}`);
    throw new Error('Unimplemented method');
  };

  /**
   * Method to generate booking code which is user-readable
   * @param tenant id of the tenant
   */
  generateCode = async (tenant: string) => {
    try {
      const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
      const count = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenant}`,
        BOOKING_COUNTER_INDEX,
      );
      return count.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenant}: ${error}`);
      throw error;
    }
  };

  /**
   * Get booking data by given id
   * @param tenant Tenant id
   * @param bookingId Booking id which is also known as booking code
   * @returns Returned Booking entity
   */
  getByGivenId = async (tenant: string, bookingId: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getItem(
      travelTable,
      `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`,
      bookingId,
    );
  };

  /**
   * Get all related booking for given tenant
   * @param tenant Tenant id
   * @returns Returned Booking array
   */
  getAll = async (tenant: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: travelTable,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`,
      },
    };

    logger.log(`Get all bookings for given tenant ${tenant}`);

    const bookings = await dynamoProvider.query(params);

    // Formatting the items and adding the id property
    return bookings.map(
      (booking) => helper.excludeDataFromObject(booking) as Booking,
    );
  };
}
