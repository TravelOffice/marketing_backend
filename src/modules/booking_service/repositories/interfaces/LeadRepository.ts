import { Lead } from '../../models/Lead';

export interface LeadRepository {
  getById: (tenantId: string, leadId: string) => Promise<Lead | undefined>
}
