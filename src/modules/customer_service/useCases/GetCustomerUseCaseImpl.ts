import { customerRepository } from '../repositories';
import { GetCustomerUseCase } from './interfaces/GetCustomerUseCase';

export default class GetCustomerUseCaseImpl implements GetCustomerUseCase {
  invoke = (tenantId: string, customerId: string) => customerRepository.get(tenantId, customerId);
}
