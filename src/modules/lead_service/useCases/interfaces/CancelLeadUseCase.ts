import { Lead } from '../../models/Lead';

export interface CancelLeadUseCase {
    invoke: (tenantId: string, leadId: string, cancelledReason: string) => Promise<Lead>
}
