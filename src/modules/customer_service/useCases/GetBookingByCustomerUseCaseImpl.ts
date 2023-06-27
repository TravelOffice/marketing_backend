import { bookingRepository } from '../repositories';
import { GetBookingByCustomerUseCase } from './interfaces/GetBookingByCustomerUseCase';

export default class GetBookingByCustomerUseCaseImpl implements GetBookingByCustomerUseCase {
  invoke = async (
    tenantId: string,
    customerId: string,
  ) => bookingRepository.getByCustomer(tenantId, customerId);
}
