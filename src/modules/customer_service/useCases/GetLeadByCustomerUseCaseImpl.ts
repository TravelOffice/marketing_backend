import { leadRepository } from '../repositories';
import { GetLeadByCustomerUseCase } from './interfaces/GetLeadByCustomerUseCase';

export default class GetLeadByCustomerUseCaseImpl implements GetLeadByCustomerUseCase {
  invoke = async (
    tenantId: string,
    customerId: string,
  ) => leadRepository.getByCustomer(tenantId, customerId);
}
