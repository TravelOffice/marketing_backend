import { Lead } from '../../models/Lead';

export interface LeadRepository {
  getByCustomer: (tenantId: string, customerId: string) => Promise<Lead[]>,
}
