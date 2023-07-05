import logger from '../utils/logger';
import { Booking } from '../models/booking/Booking';
import { bookingRepository } from '../repositories';
import { UpdateBookingUseCase } from './interfaces/UpdateBookingUseCase';

export default class UpdateBookingUseCaseImpl implements UpdateBookingUseCase {
  invoke = (
    tenant: string,
    bookingId: string,
    booking: Booking,
  ) => {
    logger.log(`Start updating booking data for tenant ${tenant} bookingId ${bookingId}`);
    return bookingRepository.update(tenant, bookingId, booking);
  };
}
