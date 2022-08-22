import MailProvider from './MailProvider';

interface Providers {
  mailProvider: MailProvider,
}

const providers: Providers = {
  mailProvider: new MailProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const { mailProvider } = providers;

export { SESSendEmailRequest } from './MailProvider';
