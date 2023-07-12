import { getAwsSecretValue } from 'get-env';
import {
  dynamoProvider,
  helper,
  KeyList,
  QueryInput,
  UpdateItemInput,
} from 'core';
import {
  Booking,
  BookingStatus,
  BookingStatusEnum,
  statusTransitionRules,
} from '../models/booking/Booking';
import {
  ASSIGNEE_INDEX,
  BOOKING_COUNTER_INDEX,
  BOOKING_INDEX,
  BOOKING_STATUS_INDEX,
  CUSTOMER_INDEX,
  LEAD_INDEX,
  TENANT_INDEX,
  TOUR_TEMPLATE_INDEX,
  UPDATED_AT_INDEX,
} from '../utils/constants';
import { BookingRepository } from './interfaces/BookingRepository';
import logger from '../utils/logger';
import { customerRepository } from './index';
import { compact, uniqueItems } from '../utils/array';
import { Customer } from '../models/Customer';
import { Lead } from '../models/Lead';
import { TourTemplate } from '../models/tour/TourTemplate';

const buildBatchReqItems = (
  pk: string,
  ids: string[],
) => ids.map((id) => ({ pk, sk: id })) as KeyList;

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

  /**
   * Update booking data for tenant
   * @param tenant Tenant id
   * @param bookingId Booking code
   * @param booking Booking data to update
   * @returns Updated booking data
   */
  update = async (tenant: string, bookingId: string, booking: Booking) => {
    // Table, {pk, sk} values
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`;
    const sk = bookingId;

    logger.log(`Updating booking for tenant ${tenant} with pk: ${pk}, sk: ${sk}`);
    logger.log(`New booking data ${JSON.stringify(booking)}`);

    // Booking should be existed in database
    const existingBooking = await dynamoProvider.getItem<Booking>(table, pk, sk);
    if (!existingBooking) {
      throw new Error(`Booking with id ${bookingId} not found for tenant ${tenant}`);
    }

    // Verify status transition
    const statusTransition = `${existingBooking.bookingStatus}-${booking.bookingStatus}`;
    if (!statusTransitionRules.includes(statusTransition)) {
      throw new Error(`Status could not be changed from ${existingBooking.bookingStatus} to ${booking.bookingStatus}`);
    }

    const updatedAt = Date.now();

    // Indexes should be changed according to some values such as createdDate, assignee
    const lsi2 = `${UPDATED_AT_INDEX}#${updatedAt}`; // updatedAt lsi
    const lsi5 = `${ASSIGNEE_INDEX}#${booking.assigneeId}`; // assignee lsi

    // Code, createdAt should not be changed
    const { code, createdAt, ...bookingToUpdate } = booking;

    // Update booking item to database
    const result = await dynamoProvider.updateItemWithSetExpression(
      table,
      pk,
      sk,
      {
        ...bookingToUpdate, lsi2, lsi5, updatedAt,
      },
    );

    const updatedBooking = result.Attributes as Booking;

    logger.log(`Booking with id ${bookingId} has been updated successfully for tenant ${tenant}`);

    // Check if the booking status is "COMPLETED" and update customer revenue
    if (updatedBooking.bookingStatus === BookingStatusEnum.COMPLETED) {
      // Update the customer's revenue using customerRepository.updateRevenue
      await customerRepository.updateRevenue(
        tenant,
        updatedBooking.customerId,
        updatedBooking.totalPayment!,
      );
      // Log a success message indicating the customer's revenue has been updated
      logger.log(`Update customer ${updatedBooking.customerId} revenue successfully`);
    }

    return helper.excludeDataFromObject(bookingToUpdate) as Booking;
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
    const result = await dynamoProvider.getItem(
      travelTable,
      `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`,
      bookingId,
    );
    return helper.excludeDataFromObject(result) as Booking;
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
      const canceledStatus = BookingStatusEnum.CANCELED;
      const updateParams: UpdateItemInput = {
        TableName: travelTable,
        Key: {
          pk,
          sk,
        },
        UpdateExpression: 'SET bookingStatus = :status, canceledReason = :reason, updatedAt = :updatedAt, lsi3 = :lsi3',
        ExpressionAttributeValues: {
          ':status': canceledStatus,
          ':reason': reason,
          ':updatedAt': Date.now(),
          ':lsi3': `${BOOKING_STATUS_INDEX}#${canceledStatus}`,
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

  fetchBookingsRelatedItems = async (tenant: string, bookings: Booking[]) => {
    // Pks
    const customerPk = `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`;
    const leadPk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    const tourTemplatePk = `${TENANT_INDEX}#${tenant}#${TOUR_TEMPLATE_INDEX}`;

    // Fetch all related data of bookings
    // such as leads, tour templates and so on
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const customerIds = uniqueItems(compact(bookings.map((booking) => booking.customerId)));
    const leadIds = uniqueItems(compact(bookings.map((booking) => booking.tourLeadId)));
    const tourTemplateIds = uniqueItems(compact(bookings.map((booking) => booking.tourTemplateId)));
    const keys: KeyList = ([] as KeyList)
      .concat(buildBatchReqItems(customerPk, customerIds))
      .concat(buildBatchReqItems(leadPk, leadIds as string[]))
      .concat(buildBatchReqItems(tourTemplatePk, tourTemplateIds as string[]));

    const responses = await dynamoProvider.batchGetItems({
      RequestItems: {
        [table]: { Keys: keys },
      },
    });
    const bookingRelatedItems = responses[table];
    const customers = bookingRelatedItems
      .filter((item) => item.pk === customerPk)
      .map((item) => helper.excludeDataFromObject(item)) as Customer[];
    const leads = bookingRelatedItems
      .filter((item) => item.pk === leadPk)
      .map((item) => helper.excludeDataFromObject(item)) as Lead[];
    const tourTemplates = bookingRelatedItems
      .filter((item) => item.pk === tourTemplatePk)
      .map((item) => helper.excludeDataFromObject(item)) as TourTemplate[];

    return { customers, leads, tourTemplates };
  };
}
