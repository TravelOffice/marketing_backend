import { Receipt } from '../../models/Receipt';

export interface GetReceiptListUseCase {
  invoke: (tenantId: string) => Promise<Array<Receipt>>;
}
