import { Page } from '../../models';

export interface GetLinkedPagesUseCase {
  invoke: (tenantId: string) => Promise<Array<Page>>;
}
