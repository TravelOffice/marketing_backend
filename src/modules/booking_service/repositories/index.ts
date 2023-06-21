import BookingRepositoryImpl from './BookingRepositoryImpl';
import CustomerRepositoryImpl from './CustomerRepositoryImpl';
import { BookingRepository } from './interfaces/BookingRepository';
import { CustomerRepository } from './interfaces/CustomerRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  bookingRepository: BookingRepository,
  userRepository: UserRepository,
  customerRepository: CustomerRepository,
}

const repositories: Repositories = {
  bookingRepository: new BookingRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  customerRepository: new CustomerRepositoryImpl(),
};

export const {
  bookingRepository,
  userRepository,
  customerRepository,
} = repositories;
