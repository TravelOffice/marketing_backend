import { Lead } from '../../models/Lead';

export interface CreateLeadUseCase {
  invoke : (lead: Lead, userId: string) => Promise<Lead>
}
