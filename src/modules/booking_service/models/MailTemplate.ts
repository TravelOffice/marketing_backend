export interface MailTemplate {
  toAddresses: string[],
  ccAddresses: string[],
  subject: string,
  html?: string,
  text?: string,
}
