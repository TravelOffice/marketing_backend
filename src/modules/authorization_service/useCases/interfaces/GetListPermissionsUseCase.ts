import { Permission } from '../../models';

export interface GetListPermissionsUseCase {
  invoke: () => Promise<Array<Permission>>
}
