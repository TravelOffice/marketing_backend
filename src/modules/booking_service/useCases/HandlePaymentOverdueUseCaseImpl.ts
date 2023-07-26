import { bookingRepository } from '../repositories';
import { HandlePaymentOverdueUseCase } from './interfaces/HandlePaymentOverdueUseCase';
import { BookingStatusEnum } from '../models/booking/Booking';

export default class HandlePaymentOverdueUseCaseImpl implements HandlePaymentOverdueUseCase {
  invoke = async (tenant: string, bookingId: string, ruleName: string) => {
    await bookingRepository.deletePaymentDeadline(ruleName);
    await bookingRepository.update(tenant, bookingId, {
      bookingStatus: BookingStatusEnum.IN_PROCESS,
      updatedAt: Date.now(),
    });
  };
}
