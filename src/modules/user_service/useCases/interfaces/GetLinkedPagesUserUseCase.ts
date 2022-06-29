import { Page } from '../../models/Page';

export interface GetLinkedPagesUseCase {
  invoke: (userId: string) => Promise<Array<Page>>;
}
