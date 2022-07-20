import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Booking, BookingStatus } from '../models/Booking';
import { dynamoProvider } from '../providers';
import {
  LEAD_INDEX, BOOKING_INDEX, TENANT_INDEX, LATEST_BOOKING_INDEX,
} from '../utils/constants';
import { BookingRepository } from './interfaces/BookingRepository';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class BookingRepositoryImpl implements BookingRepository {
  /**
   * Function to get bookings list by leadId and filter by status
   * @param tenantId Tenant ID
   * @param leadId Lead ID
   * @param status Status
   * @returns a Promise of bookings list
   */
  listByLead = async (tenantId: string, leadId: string, status?: BookingStatus) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    let filterLsi = `${LEAD_INDEX}#${leadId}#${LATEST_BOOKING_INDEX}`;
    if (status) {
      filterLsi = `${LEAD_INDEX}#${leadId}#${LATEST_BOOKING_INDEX}#${status}`;
    }

    const params: QueryInput = {
      TableName: dynamoTable,
      IndexName: 'TypeIndex',
      KeyConditionExpression: 'pk = :pk AND begins_with(typeLsi, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${BOOKING_INDEX}` },
        ':lsi_filter_value': { S: filterLsi },
      },
    };
    const { Items: bookings } = await dynamoProvider.rawQuery(params);
    if (bookings) {
      return bookings.map((item: AWS.DynamoDB.AttributeMap) => {
        const booking = AWS.DynamoDB.Converter.unmarshall(item);
        const {
          sk, pk, typeLsi, ...rest
        } = booking;
        return rest as Booking;
      });
    }
    return [];
  };
}
