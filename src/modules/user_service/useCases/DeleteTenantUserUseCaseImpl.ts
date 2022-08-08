import { userRepository } from '../repositories';
import { DeleteTenantUserUseCase } from './interfaces/DeleteTenantUserUseCase';

export default class DeleteTenantUserUseCaseImpl implements DeleteTenantUserUseCase {
  invoke = async (tenantId: string, userId: string) => userRepository.delete(tenantId, userId);
}
