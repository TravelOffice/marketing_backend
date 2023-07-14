import { supplierRepository } from '../repositories';
import { DeleteSupplierUseCase } from './interfaces/DeleteSupplierUseCase';

export default class DeleteSupplierUseCaseImpl
implements DeleteSupplierUseCase {
  invoke = async (
    tenantId: string,
    supplierId: string,
  ) => supplierRepository.delete(tenantId, supplierId);
}
