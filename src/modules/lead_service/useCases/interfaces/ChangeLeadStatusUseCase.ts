import { Lead, LeadStatus } from '../../models/Lead';

export interface ChangeLeadStatusUseCase {
    invoke: (tenantId: string, leadId: string, status: LeadStatus) => Promise<Lead>
}
