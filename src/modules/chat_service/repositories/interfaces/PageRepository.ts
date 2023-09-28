import { Page } from '../../models/dynamodb/Page';

export interface PageRepository {
  list: (tenantId: string) => Promise<Array<Page>>
}
