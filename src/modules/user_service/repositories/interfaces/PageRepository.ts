import { Page } from '../../models/Page';

export interface PageRepository {
  list: (tenantId: string) => Promise<Array<Page>>
}
