import { Lead } from '../../models/Lead';

export interface ChangeLeadAssigneeUseCase {
    invoke: (tenantId: string, leadId: string, assignee: string) => Promise<Lead>
}
