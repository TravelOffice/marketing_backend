import AppSyncProvider from './AppSyncProvider';
import MailProvider from './MailProvider';

interface Providers {
  mailProvider: MailProvider,
  appSyncProvider: AppSyncProvider,
}

const providers: Providers = {
  mailProvider: new MailProvider(),
  appSyncProvider: new AppSyncProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const { mailProvider, appSyncProvider } = providers;
