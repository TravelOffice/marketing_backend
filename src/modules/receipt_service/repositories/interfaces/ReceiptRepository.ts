import { Receipt } from '../../models/Receipt';

export interface ReceiptRepository {
  generateReceiptCode: (tenantId: string) => Promise<string>
  list: (tenantId: string) => Promise<Array<Receipt>>
  create: (tenantId: string, receipt: Receipt) => Promise<Receipt>
  get: (tenantId: string, id: string) => Promise<Receipt>
  update: (tenantId: string, id: string, receipt: Receipt) => Promise<Receipt>
  delete: (tenantId: string, id: string) => Promise<string>
}
