import { Lead } from '../../models/Lead';

export interface GetLeadListUseCase {
  invoke: (tenantId: string) => Promise<Array<Lead>>;
}
