import { Booking } from '../../models/Booking';

export interface BookingRepository {
  getByCustomer: (tenantId: string, customerId: string) => Promise<Booking[]>,
}
