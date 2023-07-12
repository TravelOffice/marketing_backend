import { Supplier } from '../models/Supplier';
import { supplierRepository } from '../repositories';
import { CreateSupplierUseCase } from './interfaces/CreateSupplierUseCase';

export default class CreateSupplierUseCaseImpl
implements CreateSupplierUseCase {
  invoke = async (
    tenantId: string,
    supplier: Supplier,
  ) => {
    const now = Date.now();
    const code = await supplierRepository.generateCode(tenantId);
    const supplierToAdd: Supplier = {
      ...supplier,
      code,
      createdAt: now,
      updatedAt: now,
    };
    return supplierRepository.create(tenantId, supplierToAdd);
  };
}
