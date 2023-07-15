import { Quote } from '../models/Supplier';
import { supplierRepository } from '../repositories';
import { UpdateSupplierQuoteUseCase } from './interfaces/UpdateSupplierQuoteUseCase';

export default class UpdateSupplierQuoteUseCaseImpl
implements UpdateSupplierQuoteUseCase {
  invoke = (
    tenantId: string,
    supplierId: string,
    quotes: Array<Quote>,
  ) => supplierRepository.updateQuotes(tenantId, supplierId, quotes);
}
