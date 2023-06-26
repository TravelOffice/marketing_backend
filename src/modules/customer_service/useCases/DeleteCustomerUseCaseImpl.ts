import { customerRepository } from '../repositories';
import { DeleteCustomerUseCase } from './interfaces/DeleteCustomerUseCase';

export default class DeleteCustomerUseCaseImpl implements DeleteCustomerUseCase {
  invoke = async (
    tenantId: string,
    customerId: string,
  ) => customerRepository.delete(tenantId, customerId);
}
