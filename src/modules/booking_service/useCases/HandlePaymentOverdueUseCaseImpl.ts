import { bookingRepository } from '../repositories';
import { HandlePaymentOverdueUseCase } from './interfaces/HandlePaymentOverdueUseCase';
import { BookingStatusEnum } from '../models/booking/Booking';
import { BOOKING_STATUS_INDEX } from '../utils/constants';

export default class HandlePaymentOverdueUseCaseImpl implements HandlePaymentOverdueUseCase {
  invoke = async (tenant: string, bookingId: string, ruleName: string) => {
    await bookingRepository.deletePaymentDeadline(ruleName);
    await bookingRepository.update(tenant, bookingId, {
      bookingStatus: BookingStatusEnum.IN_PROCESS,
      lsi3: `${BOOKING_STATUS_INDEX}#${BookingStatusEnum.IN_PROCESS}`, // <status>,
      updatedAt: Date.now(),
    });
  };
}
