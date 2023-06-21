import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Booking, BookingStatus } from '../models/booking/Booking';
import { dynamoProvider } from '../providers';
import {
  BOOKING_CODE_INDEX,
  BOOKING_COUNTER_INDEX,
  BOOKING_INDEX,
  LATEST_BOOKING_INDEX,
  LEAD_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { BookingRepository } from './interfaces/BookingRepository';
import logger from '../utils/logger';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class BookingRepositoryImpl implements BookingRepository {
  /**
   * Function to get bookings list by leadId and filter by status
   * @param tenant Tenant ID
   * @param leadId Lead ID
   * @param status Status
   * @returns a Promise of bookings list
   */
  listByLead = async (tenant: string, leadId: string, status?: BookingStatus) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    let filterLsi = `${LEAD_INDEX}#${leadId}#${LATEST_BOOKING_INDEX}`;
    if (status) {
      filterLsi = `${LEAD_INDEX}#${leadId}#${LATEST_BOOKING_INDEX}#${status}`;
    }

    const params: QueryInput = {
      TableName: dynamoTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}` },
        ':lsi_filter_value': { S: filterLsi },
      },
    };
    const { Items: bookings } = await dynamoProvider.rawQuery(params);
    if (bookings) {
      return bookings.map((item: AWS.DynamoDB.AttributeMap) => {
        const booking = AWS.DynamoDB.Converter.unmarshall(item);
        const {
          pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...rest
        } = booking;
        return rest as Booking;
      });
    }
    return [];
  };

  /**
   * Create new direct booking
   * @param tenant Tenant id
   * @param booking Booking information
   * @returns Created booking
   */
  create = async (tenant: string, booking: Booking) => {
    await dynamoProvider.putItem({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      Item: {
        pk: `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`,
        sk: `${BOOKING_CODE_INDEX}#${booking.code}`,
        ...booking,
      },
    });
    logger.log(`Created new booking for tenant ${tenant}`);
    return booking;
  };

  createFromLead = async (tenant: string, leadId: string, booking: Booking) => {
    console.log(tenant, leadId, booking);
    throw new Error('Unimplemented method');
  };

  /**
   * Method to generate booking code which is user-readable
   * @param tenant id of the tenant
   */
  generateCode = async (tenant: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      const result = await dynamoProvider.update({
        TableName: table,
        Key: {
          pk: `${TENANT_INDEX}#${tenant}`,
          sk: BOOKING_COUNTER_INDEX,
        },
        UpdateExpression: 'SET incrIndex = if_not_exists(incrIndex, :start) + :increment',
        ExpressionAttributeValues: {
          ':start': 0, // Initial value if the attribute doesn't exist
          ':increment': 1, // Increment value
        },
        ReturnValues: 'UPDATED_NEW',
      });
      const count = result.Attributes!.incrIndex as number;
      return count.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenant}: ${error}`);
      throw error;
    }
  };
}
