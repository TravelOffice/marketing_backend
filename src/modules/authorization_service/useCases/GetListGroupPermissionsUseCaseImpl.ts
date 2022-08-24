import { rolePermissionRepository } from '../repositories';
import { GetListGroupPermissionsUseCase } from './interfaces/GetListGroupPermissionsUseCase';

export default class GetListGroupPermissionsUseCaseImpl implements GetListGroupPermissionsUseCase {
  /**
   * Method to get all group permissions
   * @returns Promise<Array<GroupPermission>> All information of list permissions
   */
  invoke = async () => rolePermissionRepository.listGroupPermissions();
}
