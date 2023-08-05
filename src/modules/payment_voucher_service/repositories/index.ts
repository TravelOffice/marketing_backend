// TODO: Declare repository objects which can be used in this service here

import PaymentVoucherRepositoryImpl from './PaymentVoucherRepositoryImpl';
import { PaymentVoucherRepository } from './interfaces/PaymentVoucherRepository';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';
import DepartureTourRepositoryImpl from './DepartureTourRepositoryImpl';
import { SupplierRepository } from './interfaces/SupplierRepository';
import SupplierRepositoryImpl from './SupplierRepositoryImpl';

interface Repositories {
  paymentVoucherRepository: PaymentVoucherRepository,
  departureTourRepository: DepartureTourRepository,
  supplierRepository: SupplierRepository,
}

const repositories: Repositories = {
  paymentVoucherRepository: new PaymentVoucherRepositoryImpl(),
  departureTourRepository: new DepartureTourRepositoryImpl(),
  supplierRepository: new SupplierRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  paymentVoucherRepository,
  departureTourRepository,
  supplierRepository,
} = repositories;
