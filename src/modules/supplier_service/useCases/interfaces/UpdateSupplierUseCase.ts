import { Supplier } from '../../models/Supplier';

export interface UpdateSupplierUseCase {
  invoke: (
    tenantId: string,
    supplierId: string,
    supplier: Supplier,
  ) => Promise<Supplier>;
}
