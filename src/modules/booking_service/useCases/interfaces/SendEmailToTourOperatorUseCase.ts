import { MailTemplate } from '../../models/MailTemplate';

export interface SendEmailToTourOperatorUseCase {
    invoke: (
        tenant: string, bookingId: string, fromAddress:string, mailTemplate: MailTemplate
    ) => Promise<MailTemplate>
}
