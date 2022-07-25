import { TenantFacebookPage } from '../../models/Facebook';

export interface PageRepository {
  get: (pageId: string) => Promise<TenantFacebookPage>
}
