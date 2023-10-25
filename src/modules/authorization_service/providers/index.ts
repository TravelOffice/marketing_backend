import AuthPolicyProvider from './AuthPolicyProvider';
import CognitoProvider from './CognitoProvider';
import AppSyncProvider from './AppSyncProvider';

interface Providers {
  authPolicyProvider: AuthPolicyProvider,
  appSyncProvider: AppSyncProvider,
  cognitoProvider: CognitoProvider,
}

const providers: Providers = {
  authPolicyProvider: new AuthPolicyProvider(),
  appSyncProvider: new AppSyncProvider(),
  cognitoProvider: new CognitoProvider(),
};

export const {
  authPolicyProvider,
  appSyncProvider,
  cognitoProvider,
} = providers;
