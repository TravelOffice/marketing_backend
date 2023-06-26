import { customerRepository } from '../repositories';
import { GetCustomerListUseCase } from './interfaces/GetCustomerListUseCase';

export default class GetCustomerListUseCaseImpl implements GetCustomerListUseCase {
  invoke = async (tenantId: string) => customerRepository.list(tenantId);
}
