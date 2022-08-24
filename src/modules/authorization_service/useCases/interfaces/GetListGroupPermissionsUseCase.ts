import { GroupPermission } from '../../models';

export interface GetListGroupPermissionsUseCase {
  invoke: () => Promise<Array<GroupPermission>>
}
