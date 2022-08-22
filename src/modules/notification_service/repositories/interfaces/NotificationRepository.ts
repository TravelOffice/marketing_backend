import { SESSendEmailResponse } from '../../providers/MailProvider';

export interface NotificationRepository {
  sendEmail: (
    fromAddress: string,
    toAddresses: string[],
    ccAddresses: string[],
    html: string,
    text: string,
    subject: string,
  ) => Promise<SESSendEmailResponse>
}
