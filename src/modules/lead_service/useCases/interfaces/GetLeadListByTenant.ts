import { Lead } from '../../models/Lead';

export interface GetLeadListByTenantUseCase {
  invoke : (userId: string) => Promise<Array<Lead>>
}
