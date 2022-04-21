import { Lead } from '../../models/Lead';

export interface UpdateLeadUseCase {
  invoke : (lead: Lead, userId: string) => Promise<Lead>
}
