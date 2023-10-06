// TODO: Declare repository objects which can be used in this service here

import BookingRepositoryImpl from './BookingRepositoryImpl';
import CustomerRepositoryImpl from './CustomerRepositoryImpl';
import DepartureTourRepositoryImpl from './DepartureTourRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import { BookingRepository } from './interfaces/BookingRepository';
import { CustomerRepository } from './interfaces/CustomerRepository';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';
import { UserRepository } from './interfaces/UserRepository';
import { DatabaseRepository } from './interfaces/DatabaseRepository';
import DatabaseRepositoryImpl from './DatabaseRepositoryImpl';
import { PaymentVoucherRepository } from './interfaces/PaymentVoucherRepository';
import PaymentVoucherRepositoryImpl from './PaymentVoucherRepositoryImpl';

interface Repositories {
  departureTourRepository: DepartureTourRepository,
  userRepository: UserRepository,
  bookingRepository: BookingRepository,
  customerRepository: CustomerRepository,
  databaseRepository: DatabaseRepository,
  paymentVoucherRepository: PaymentVoucherRepository
}

const repositories: Repositories = {
  departureTourRepository: new DepartureTourRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  bookingRepository: new BookingRepositoryImpl(),
  customerRepository: new CustomerRepositoryImpl(),
  databaseRepository: new DatabaseRepositoryImpl(),
  paymentVoucherRepository: new PaymentVoucherRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  departureTourRepository,
  userRepository,
  bookingRepository,
  customerRepository,
  databaseRepository,
  paymentVoucherRepository,
} = repositories;
