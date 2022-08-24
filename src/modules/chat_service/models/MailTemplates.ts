/**
 * Fixed mail template for tenant
 * Tenant admin can edit any template from web application
 */
export interface MailTemplate {
  toAddresses: string[],
  ccAddresses: string[],
  subject: string,
  html: string,
  text: string,
}

/**
 * All the templates are object contains:
 * - toAddresses
 * - ccAddresses
 * - subject
 * - html
 * - text
 */
export interface MailTemplates {
  // Template for assign chat success
  aancs: MailTemplate,
  // Template for assign chat no available sale
  aanas: MailTemplate,
  // Templaye for assign chat not response chat conversation
  aanrnc: MailTemplate,
}

export type MailKey = keyof MailTemplates;
