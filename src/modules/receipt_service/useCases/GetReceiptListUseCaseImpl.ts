import { helper } from 'core';
import { Receipt } from '../models/Receipt';
import { receiptRepository } from '../repositories';
import { GetReceiptListUseCase } from './interfaces/GetReceiptListUseCase';

export default class GetReceiptListUseCaseImpl implements GetReceiptListUseCase {
  invoke = async (tenantId: string) => {
    const items = await receiptRepository.list(tenantId);
    // Formatting the items and exclude the key property
    return items.map(
      (item) => helper.excludeDataFromObject(item) as Receipt,
    );
  };
}
