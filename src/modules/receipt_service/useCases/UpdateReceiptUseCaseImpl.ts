import { helper } from 'core';
import { Receipt, ReceiptStatus } from '../models/Receipt';
import { receiptRepository } from '../repositories';
import { UpdateReceiptUseCase } from './interfaces/UpdateReceiptUseCase';
import { STATUS_INDEX, UPDATED_AT_INDEX } from '../utils/constants';

export default class UpdateReceiptUseCaseImpl implements UpdateReceiptUseCase {
  private allowedUpdatingKeys: (keyof Receipt)[] = [
    'paymentMethod',
    'amount',
    'description',
    'note',
  ];

  invoke = async (
    tenantId: string,
    id: string,
    receipt: Receipt,
  ) => {
    const now = Date.now();
    const existingTourLocation = await receiptRepository.get(tenantId, id);
    if (!existingTourLocation) {
      throw new Error(`Tour Location [${id}] not found for tenant ${tenantId}`);
    }
    if (existingTourLocation.status === ReceiptStatus.CLOSED) {
      throw new Error(`Can't update receipt [${id}], it was closed`);
    }
    const receiptToUpdate: Receipt = {
      ...existingTourLocation,
      ...helper.extractDataFromObject(receipt, this.allowedUpdatingKeys),
      updatedAt: now,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${receipt.status}`,
    };

    await receiptRepository.update(
      tenantId,
      id,
      receiptToUpdate,
    );

    return helper.excludeDataFromObject(receiptToUpdate) as Receipt;
  };
}
