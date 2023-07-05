// TODO: Declare repository objects which can be used in this service here

import PaymentVoucherRepositoryImpl from './PaymentVoucherRepositoryImpl';
import { PaymentVoucherRepository } from './interfaces/PaymentVoucherRepository';

interface Repositories {
  paymentVoucherRepository: PaymentVoucherRepository,
}

const repositories: Repositories = {
  paymentVoucherRepository: new PaymentVoucherRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  paymentVoucherRepository,
} = repositories;
