import { Lead } from '../../models/Lead';

export interface LeadRepository {
  createOrUpdate: (tenantId: string, lead: Lead) => Promise<Lead>,
}
