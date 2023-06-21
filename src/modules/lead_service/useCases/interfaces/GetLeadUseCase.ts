import { Lead } from '../../models/Lead';

export interface GetLeadUseCase {
  invoke: (tenantId: string, leadId: string) => Promise<Lead>;
}
