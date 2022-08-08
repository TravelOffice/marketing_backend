import { Page } from '../../models/Page';

export interface GetLinkedPagesUseCase {
  invoke: (tenantId: string) => Promise<Array<Page>>;
}
