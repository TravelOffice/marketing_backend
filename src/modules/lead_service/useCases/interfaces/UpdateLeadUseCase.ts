import { Lead } from '../../models/Lead';
import { UpdateLeadDto } from '../../dto/UpdateLeadDto';

export interface UpdateLeadUseCase {
  invoke: (tenantId: string, leadId: string, updateLeadDto: UpdateLeadDto) => Promise<Lead>;
}
