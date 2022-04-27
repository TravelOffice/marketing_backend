import { Lead, LeadStatus, LeadType } from '../../models/Lead';

export interface GetLeadListByAssigneeUseCase {
  invoke : (userId: string, type: LeadType, status: LeadStatus) => Promise<Array<Lead>>
}
