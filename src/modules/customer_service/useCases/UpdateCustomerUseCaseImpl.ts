import { Customer } from '../models/Customer';
import { customerRepository } from '../repositories';
import { UpdateCustomerUseCase } from './interfaces/UpdateCustomerUseCase';

export default class UpdateCustomerUseCaseImpl implements UpdateCustomerUseCase {
  invoke = (
    tenantId: string,
    customer: Customer,
  ) => customerRepository.update(tenantId, customer);
}
