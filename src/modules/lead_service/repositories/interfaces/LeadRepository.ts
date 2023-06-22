import { Lead, LeadStatus } from '../../models/Lead';

export interface LeadRepository {
  getById: (tenantId: string, leadId: string) => Promise<Lead | undefined>,
  create: (tenantId: string, lead: Lead) => Promise<Lead>,
  update: (tenantId: string, lead: Lead) => Promise<Lead>,
  delete: (tenantId: string, leadId: Lead) => Promise<void>,
  changeAssignee: (tenantId: string, leadId: string, saleId: string) => Promise<void>,
  changeStatus: (tenantId: string, leadId: string, status: LeadStatus) => Promise<Lead>,
  cancel: (tenantId: string, leadId: string, reason: string) => Promise<Lead>,
}
