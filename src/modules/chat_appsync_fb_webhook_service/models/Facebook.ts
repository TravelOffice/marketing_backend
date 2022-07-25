import { FacebookConversation, FacebookPage } from 'common-models';

export type FacebookMessageResponseData = Array<FacebookConversation>;

export interface FacebookMessageResponsePayload {
  data: FacebookMessageResponseData;
  paging: {
    cursors: {
      before: string,
      after: string
    }
  };
}

export interface TenantFacebookPage extends FacebookPage {
  tenantId: string,
}
