import { helper } from 'core';
import { departureTourRepository, paymentVoucherRepository, supplierRepository } from '../repositories';
import {
  CREATED_AT_INDEX, CREATOR_INDEX, STATUS_INDEX, TOUR_OPERATION_INDEX, UPDATED_AT_INDEX,
} from '../utils/constants';
import { CreatePaymentVoucherUseCase } from './interfaces/CreatePaymentVoucherUseCase';
import { PaymentVoucher, PaymentVoucherStatus } from '../models/PaymentVoucher';
import { CognitoUser } from '../models/CognitoUser';

export default class CreatePaymentVoucherUseCaseImpl implements CreatePaymentVoucherUseCase {
  private allowedCreatingKeys: (keyof PaymentVoucher)[] = [
    'amount',
    'receiverId',
    'description',
    'note',
    'tourId',
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
    const { tourId } = paymentVoucher;
    const { tenant, username, name } = userInfo;

    const departureTour = await departureTourRepository.get(tenant, tourId);
    if (!departureTour) throw new Error(`Could not found tour with code ${tourId}`);

    const supplier = await supplierRepository.get(tenant, paymentVoucher.receiverId);
    if (!supplier) throw new Error(`Could not found receiver with code ${paymentVoucher.receiverId}`);

    const code = await paymentVoucherRepository.generatePaymentVoucherCode(tenant);
    const paymentVoucherToAdd: PaymentVoucher = {
      ...(helper.extractDataFromObject(paymentVoucher, this.allowedCreatingKeys) as PaymentVoucher),
      code,
      status: PaymentVoucherStatus.WAIT_FOR_APPROVAL,
      createdAt: now,
      updatedAt: now,
      creatorId: username,
      creatorName: name,
      receiverName: supplier.name,
      lsi1: `${CREATED_AT_INDEX}#${now}`,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${PaymentVoucherStatus.WAIT_FOR_APPROVAL}`,
      lsi4: `${CREATOR_INDEX}#${username}`,
      lsi5: tourId ? `${TOUR_OPERATION_INDEX}#${tourId}` : '',
    };
    await paymentVoucherRepository.create(tenant, paymentVoucherToAdd);
    return helper.excludeDataFromObject(paymentVoucherToAdd) as PaymentVoucher;
  };
}
