import { getAwsSecretValue } from 'get-env';
import {
  QueryInput, dynamoProvider, helper, UpdateItemInput,
} from 'core';
import { Booking, BookingStatus, BookingStatusEnum } from '../models/booking/Booking';
import {
  BOOKING_COUNTER_INDEX,
  BOOKING_INDEX,
  BOOKING_STATUS_INDEX,
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

  /**
   * Get list of booking by given status
   * @param tenant Tenant id
   * @param status Status of booking
   * @returns List of bookings that filtered by status
   */
  getListByStatus = async (tenant: string, status: BookingStatus) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: travelTable,
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk and lsi3 = :lsi3',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`,
        ':lsi3': `${BOOKING_STATUS_INDEX}#${status}`,
      },
    };

    logger.log(`Get all bookings for given tenant ${tenant} with specific status ${status}`);

    const bookings = await dynamoProvider.query(params);

    // Formatting the items and adding the id property
    return bookings.map(
      (booking) => helper.excludeDataFromObject(booking) as Booking,
    );
  };

  cancel = async (tenantId: string, bookingId: string, reason: string) => {
    try {
      // Log the start of the cancellation process
      logger.log('Cancellation process started.');

      // Retrieve the name of the DynamoDB table where travel data is stored
      const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

      // Construct the partition key and sort key for the booking in the DynamoDB table
      const pk = `${TENANT_INDEX}#${tenantId}#${BOOKING_INDEX}`;
      const sk = bookingId;

      // Define the parameters for updating the booking in the DynamoDB table
      const updateParams: UpdateItemInput = {
        TableName: travelTable,
        Key: {
          pk,
          sk,
        },
        UpdateExpression: 'SET bookingStatus = :status, canceledReason = :reason, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':status': BookingStatusEnum.CANCELED,
          ':reason': reason,
          ':updatedAt': Date.now(),
        },
        ReturnValues: 'UPDATED_NEW',
      };

      // Update the booking in the DynamoDB table and retrieve the updated attributes
      const rs = await dynamoProvider.rawUpdateItem(updateParams);

      // Log the success of the cancellation process
      logger.log('Cancellation process completed successfully.');

      // Return the updated booking attributes
      return rs.Attributes as Booking;
    } catch (error) {
      // Log any errors that occur during the cancellation process
      logger.log(`Error canceling booking: ${error}`);

      // Rethrow the error to be handled by the caller
      throw error;
    }
  };
}
