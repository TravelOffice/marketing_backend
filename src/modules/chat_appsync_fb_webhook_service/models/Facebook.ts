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

export enum MessageGroupType {
  TEXT = 'TEXT',
  MEDIA = 'MEDIA',
  LINK = 'LINK',
  FILE = 'FILE',
  OTHER = 'OTHER',
}
