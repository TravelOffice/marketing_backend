import { rolePermissionRepository } from '../repositories';
import { GetListPermissionsUseCase } from './interfaces/GetListPermissionsUseCase';

export default class GetListPermissionsUseCaseImpl implements GetListPermissionsUseCase {
  /**
   * Method to get all permission
   * @returns Promise<Array<Permission>> All information of list permissions
   */
  invoke = async () => rolePermissionRepository.listPermissions();
}
