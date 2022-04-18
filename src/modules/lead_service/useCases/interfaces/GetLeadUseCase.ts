import { Lead } from '../../models/Lead';

export interface GetLeadUseCase {
  invoke : (leadId: string, userId: string) => Promise<Lead | undefined>
}
