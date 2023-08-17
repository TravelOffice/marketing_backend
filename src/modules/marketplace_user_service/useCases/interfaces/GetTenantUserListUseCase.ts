import { TravelUser } from '../../models';

export interface GetTenantUserListUseCase {
  invoke: (tenantId: string) => Promise<Array<Partial<TravelUser>>>;
}
