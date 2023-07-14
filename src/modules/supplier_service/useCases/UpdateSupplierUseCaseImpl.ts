import { UpdateSupplierUseCase } from './interfaces/UpdateSupplierUseCase';
import { Supplier } from '../models/Supplier';
import { supplierRepository } from '../repositories';

export default class UpdateSupplierUseCaseImpl
implements UpdateSupplierUseCase {
  invoke = (
    tenantId: string,
    supplierId: string,
    supplier: Supplier,
  ) => supplierRepository.update(tenantId, supplierId, supplier);
}
