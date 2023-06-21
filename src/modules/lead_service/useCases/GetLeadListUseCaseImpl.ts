import { leadRepository } from '../repositories';
import { GetLeadListUseCase } from './interfaces/GetLeadListUseCase';

export default class GetLeadListUseCaseImpl implements GetLeadListUseCase {
  invoke = async (tenantId: string) => leadRepository.list(tenantId);
}
