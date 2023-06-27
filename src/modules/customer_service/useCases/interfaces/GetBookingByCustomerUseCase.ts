import { Booking } from '../../models/Booking';

export interface GetBookingByCustomerUseCase {
  invoke: (tenantId: string, customerId: string) => Promise<Booking[]>;
}
