import { Lead, LeadStatus } from '../../models/Lead';

export interface ChangeLeadStatusUseCase {
    invoke: (tenantId: string, userId: string, leadId: string, status: LeadStatus) => Promise<Lead>
}
