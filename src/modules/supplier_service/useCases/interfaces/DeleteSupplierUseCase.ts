export interface DeleteSupplierUseCase {
  invoke: (tenantId: string, supplierId: string) => Promise<string>;
}
