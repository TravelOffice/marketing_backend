import { Quote, Supplier } from '../../models/Supplier';

export interface UpdateSupplierQuoteUseCase {
  invoke: (
    tenantId: string,
    supplierId: string,
    quotes: Array<Quote>,
  ) => Promise<Supplier>;
}
