import { helper } from 'core';
import { receiptRepository } from '../repositories';
import { CREATED_AT_INDEX, STATUS_INDEX, UPDATED_AT_INDEX } from '../utils/constants';
import { CreateReceiptUseCase } from './interfaces/CreateReceiptUseCase';
import { Receipt, ReceiptStatus } from '../models/Receipt';
import { CognitoUser } from '../models/CognitoUser';

export default class CreateReceiptUseCaseImpl implements CreateReceiptUseCase {
  private allowedCreatingKeys: (keyof Receipt)[] = [
    'paymentMethod',
    'amount',
    'description',
    'note',
  ];

  invoke = async (
    userInfo: CognitoUser,
    receipt: Receipt,
  ) => {
    const now = Date.now();
    const code = await receiptRepository.generateReceiptCode(userInfo.tenant);
    const receiptToAdd: Receipt = {
      ...(helper.extractDataFromObject(receipt, this.allowedCreatingKeys) as Receipt),
      code,
      status: ReceiptStatus.OPEN,
      createdAt: now,
      updatedAt: now,
      creatorId: userInfo.username,
      creatorName: userInfo.name,
      lsi1: `${CREATED_AT_INDEX}#${now}`,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${ReceiptStatus.OPEN}`,
    };
    await receiptRepository.create(userInfo.tenant, receiptToAdd);
    return helper.excludeDataFromObject(receiptToAdd) as Receipt;
  };
}
