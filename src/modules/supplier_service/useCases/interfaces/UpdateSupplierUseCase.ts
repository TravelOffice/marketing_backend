import { Supplier } from '../../models/Supplier';

export interface UpdateSupplierUseCase {
  invoke: (
    tenantId: string,
    tourTemplateId: string,
    supplier: Supplier,
  ) => Promise<Supplier>;
}
