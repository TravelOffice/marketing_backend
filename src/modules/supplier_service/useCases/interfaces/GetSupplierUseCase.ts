import { Supplier } from '../../models/Supplier';

export interface GetSupplierUseCase {
  invoke: (
    tenantId: string,
    supplierId: string,
  ) => Promise<Supplier | undefined>;
}
