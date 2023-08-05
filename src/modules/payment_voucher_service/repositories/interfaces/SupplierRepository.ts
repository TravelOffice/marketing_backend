import { Supplier } from '../../models/Supplier';

export interface SupplierRepository {
  get: (
    tenantId: string,
    supplierId: string,
  ) => Promise<Supplier | undefined>;
}
