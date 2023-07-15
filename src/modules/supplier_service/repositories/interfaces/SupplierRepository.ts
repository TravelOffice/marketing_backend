import { Quote, Supplier } from '../../models/Supplier';

export interface SupplierRepository {
  generateCode: (tenantId: string) => Promise<string>;
  list: (tenantId: string) => Promise<Array<Supplier>>;
  create: (
    tenantId: string,
    supplier: Supplier,
  ) => Promise<Supplier>;
  get: (
    tenantId: string,
    supplierId: string,
  ) => Promise<Supplier | undefined>;
  update: (
    tenantId: string,
    supplierId: string,
    supplier: Supplier,
  ) => Promise<Supplier>;
  delete: (tenantId: string, supplierId: string) => Promise<string>;
  updateQuotes: (
    tenantId: string,
    supplierId: string,
    quotes: Array<Quote>,
  ) => Promise<Supplier>;
}
