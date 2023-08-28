import { FacebookPage } from 'common-models';

export interface FacebookPageRepository {
  exchangeUserAccessToken: (token: string) => Promise<string>,
  getPageAccessToken: (pageId: string, userAccessToken: string) => Promise<FacebookPage>,
  saveToDynamo: (tenantId: string, page: FacebookPage) => Promise<void>,
  subscribePage: (pageId: string, pageAccessToken: string) => Promise<void>,
}
