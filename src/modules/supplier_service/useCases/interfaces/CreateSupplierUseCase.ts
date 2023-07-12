import { Supplier } from '../../models/Supplier';

export interface CreateSupplierUseCase {
  invoke: (
    tenantId: string,
    supplier: Supplier,
  ) => Promise<Supplier>;
}
