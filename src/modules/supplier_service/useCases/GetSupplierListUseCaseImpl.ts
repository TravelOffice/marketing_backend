import { supplierRepository } from '../repositories';
import { GetSupplierListUseCase } from './interfaces/GetSupplierListUseCase';

export default class GetSupplierListUseCaseImpl
implements GetSupplierListUseCase {
  invoke = async (tenantId: string) => supplierRepository.list(tenantId);
}
