import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper, QueryInput } from 'core';
import { Booking } from '../models/booking/Booking';
import {
  BOOKING_INDEX, CUSTOMER_INDEX, DEPARTURE_TOUR_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { BookingRepository } from './interfaces/BookingRepository';
import logger from '../utils/logger';

export default class BookingRepositoryImpl implements BookingRepository {
  /**
   * Get list of booking by given departureTourId
   * @param tenant Tenant id
   * @param departureTourId departureTourId of booking
   * @returns List of bookings that filtered by departureTourId
   */
  getListByDepartureTourId = async (tenant: string, departureTourId: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: travelTable,
      IndexName: 'Index4',
      KeyConditionExpression: 'pk = :pk and lsi4 = :lsi4',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`,
        ':lsi4': `${DEPARTURE_TOUR_INDEX}#${departureTourId}`,
      },
    };

    logger.log(`Get all bookings for given tenant ${tenant} with departureTourId ${departureTourId}`);

    const bookings = await dynamoProvider.query(params);

    // Formatting the items and adding the id property
    return bookings.map(
      (booking) => helper.excludeDataFromObject(booking, ['pk', 'sk']) as Booking,
    );
  };

  /**
   * Build batch write request for bookings
   * @param tenant The ID of tenant
   * @param bookings The array of booking object
   */
  buildBatchWriteBookings = (tenant: string, bookings: Booking[]) => bookings.map((booking) => {
    const pk = `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`;
    const sk = booking.code;
    return {
      PutRequest: {
        Item: {
          ...booking,
          pk,
          sk,
          lsi5: `${CUSTOMER_INDEX}#${booking.customerId}`, // <customer_code>
          updatedAt: Date.now(),
        },
      },
    };
  });

  /**
   * Calculate revenue of booking
   * @param booking The booking object
   * @return The revenue of booking
   */
  calculateRevenue = (booking: Booking) => {
    let revenue = 0;
    // Calculate booking total payment when completed booking
    booking.services?.forEach((service) => {
      const payment = (service.price * service.quantity) * (100 + service.tax);
      revenue += payment / 100;
    });
    return revenue;
  };
}
