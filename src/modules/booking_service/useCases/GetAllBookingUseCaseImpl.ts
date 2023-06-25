import { bookingRepository } from '../repositories';
import { GetAllBookingUseCase } from './interfaces/GetAllBookingUseCase';

export default class GetAllBookingUseCaseImpl implements GetAllBookingUseCase {
  invoke = async (tenant: string) => bookingRepository.getAll(tenant);
}
