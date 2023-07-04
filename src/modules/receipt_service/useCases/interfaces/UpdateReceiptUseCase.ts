import { Receipt } from '../../models/Receipt';

export interface UpdateReceiptUseCase {
  invoke: (tenantId: string, id: string, receipt: Receipt) => Promise<Receipt>;
}
