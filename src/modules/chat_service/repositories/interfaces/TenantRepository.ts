import { MailKey, MailTemplate } from '../../models/MailTemplates';

export interface TenantRepository {
  getMailTemplate: (tenant: string, mailKey: MailKey) => Promise<MailTemplate>
}
