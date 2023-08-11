import { Booking } from '../../models/booking/Booking';

export interface BookingRepository {
  getListByDepartureTourId: (tenant: string, departureTourId: string) => Promise<Array<Booking>>,
  buildBatchWriteBookings: (
    tenant: string,
    booking: Booking[],
  ) => { PutRequest: { Item: any } }[],
}
