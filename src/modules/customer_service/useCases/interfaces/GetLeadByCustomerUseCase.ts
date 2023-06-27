import { Lead } from '../../models/Lead';

export interface GetLeadByCustomerUseCase {
  invoke: (tenantId: string, customerId: string) => Promise<Lead[]>;
}
