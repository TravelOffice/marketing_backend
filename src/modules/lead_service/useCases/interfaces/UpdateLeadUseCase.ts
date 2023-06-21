import { Lead } from '../../models/Lead';

export interface UpdateLeadUseCase {
  invoke: (tenantId: string, leadId: string, lead: Lead) => Promise<Lead>;
}
