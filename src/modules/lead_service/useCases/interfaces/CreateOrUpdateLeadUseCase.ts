import { Lead } from '../../models/Lead';

export interface CreateOrUpdateLeadUseCase {
  invoke : (lead: Lead, userId: string) => Promise<Lead>
}
