import { helper } from 'core';
import logger from '../utils/logger';
import { Receipt } from '../models/Receipt';
import { receiptRepository } from '../repositories';
import { GetReceiptUseCase } from './interfaces/GetReceiptUseCase';

export default class GetReceiptUseCaseImpl implements GetReceiptUseCase {
  invoke = async (tenantId: string, id: string) => {
    const receipt = await receiptRepository.get(tenantId, id);
    if (!receipt) {
      logger.log(`Could not found Receipt ${id} of tenant ${tenantId}`);
      throw new Error(`Could not found Receipt ${id}`);
    }
    return helper.excludeDataFromObject(receipt) as Receipt;
  };
}
