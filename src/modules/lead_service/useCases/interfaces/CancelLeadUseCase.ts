import { Lead } from '../../models/Lead';

export interface CancelLeadUseCase {
    invoke: (tenantId: string, userId: string, leadId: string, reason: string) => Promise<Lead>
}
