import { Receipt } from '../../models/Receipt';

export interface GetReceiptUseCase {
  invoke: (tenantId: string, id: string) => Promise<Receipt>;
}
