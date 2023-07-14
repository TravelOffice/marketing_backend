import { helper } from 'core';
import { paymentVoucherRepository } from '../repositories';
import {
  CREATED_AT_INDEX, CREATOR_INDEX, STATUS_INDEX, UPDATED_AT_INDEX,
} from '../utils/constants';
import { CreatePaymentVoucherUseCase } from './interfaces/CreatePaymentVoucherUseCase';
import { PaymentVoucher, PaymentVoucherStatus } from '../models/PaymentVoucher';
import { CognitoUser } from '../models/CognitoUser';

export default class CreatePaymentVoucherUseCaseImpl implements CreatePaymentVoucherUseCase {
  private allowedCreatingKeys: (keyof PaymentVoucher)[] = [
    'amount',
    'receiver',
    'description',
    'note',
    'bookingId',
    'deadline',
    'method',
    'signGroup',
    'includeTax',
    'quickApproval',
    'attachment',
  ];

  invoke = async (
    userInfo: CognitoUser,
    paymentVoucher: PaymentVoucher,
  ) => {
    const now = Date.now();
    const code = await paymentVoucherRepository.generatePaymentVoucherCode(userInfo.tenant);
    const paymentVoucherToAdd: PaymentVoucher = {
      ...(helper.extractDataFromObject(paymentVoucher, this.allowedCreatingKeys) as PaymentVoucher),
      code,
      status: PaymentVoucherStatus.WAIT_FOR_APPROVAL,
      createdAt: now,
      updatedAt: now,
      creatorId: userInfo.username,
      creatorName: userInfo.name,
      lsi1: `${CREATED_AT_INDEX}#${now}`,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${PaymentVoucherStatus.WAIT_FOR_APPROVAL}`,
      lsi4: `${CREATOR_INDEX}#${userInfo.username}`,
    };
    await paymentVoucherRepository.create(userInfo.tenant, paymentVoucherToAdd);
    return helper.excludeDataFromObject(paymentVoucherToAdd) as PaymentVoucher;
  };
}
