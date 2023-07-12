import { supplierRepository } from '../repositories';
import { GetSupplierUseCase } from './interfaces/GetSupplierUseCase';

export default class GetSupplierUseCaseImpl
implements GetSupplierUseCase {
  invoke = async (
    tenantId: string,
    supplierId: string,
  ) => supplierRepository.get(tenantId, supplierId);
}
