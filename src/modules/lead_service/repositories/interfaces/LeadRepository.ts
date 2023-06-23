import { Lead, LeadStatus } from '../../models/Lead';

export interface LeadRepository {
  getById: (tenantId: string, leadId: string) => Promise<Lead | undefined>,
  create: (tenantId: string, lead: Lead) => Promise<Lead>,
  list: (tenantId: string) => Promise<Lead[]>,
  listByAssignee: (tenantId: string, assigneeId: string) => Promise<Lead[]>,
  get: (tenantId: string, leadId: string) => Promise<Lead>,
  update: (tenantId: string, leadId: string, lead: Lead) => Promise<Lead>,
  delete: (tenantId: string, leadId: string) => Promise<void>,
  changeAssignee: (tenantId: string, leadId: string, saleId: string) => Promise<Lead>,
  changeStatus: (tenantId: string, leadId: string, status: LeadStatus) => Promise<Lead>,
  cancel: (tenantId: string, leadId: string, reason: string) => Promise<Lead>,
  generateLeadCode: (tenantId: string) => Promise<string>,
}
