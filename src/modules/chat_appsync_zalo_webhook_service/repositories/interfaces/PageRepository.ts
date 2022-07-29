import { TenantZaloPage } from '../../models/TenantZaloPage';

export interface PageRepository {
  get: (pageId: string) => Promise<TenantZaloPage>
}
