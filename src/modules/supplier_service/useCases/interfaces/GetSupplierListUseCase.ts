import { Supplier } from '../../models/Supplier';

export interface GetSupplierListUseCase {
  invoke: (tenantId: string) => Promise<Array<Supplier>>;
}
