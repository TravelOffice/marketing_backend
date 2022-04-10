import { Lead } from '../../models/Lead';

export interface GetLeadListByAssigneeUseCase {
  invoke : (userId: string) => Promise<Array<Lead>>
}
