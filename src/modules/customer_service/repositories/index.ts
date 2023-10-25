import { CustomerRepository } from './interfaces/CustomerRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import CustomerRepositoryImpl from './CustomerRepositoryImpl';
import { LeadRepository } from './interfaces/LeadRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import { BookingRepository } from './interfaces/BookingRepository';
import BookingRepositoryImpl from './BookingRepositoryImpl';
import SourceRepositoryImpl from './SourceRepositoryImpl';
import { SourceRepository } from './interfaces/SourceRepository';

interface Repositories {
  customerRepository: CustomerRepository,
  userRepository: UserRepository,
  leadRepository: LeadRepository,
  bookingRepository: BookingRepository,
  sourceRepository: SourceRepository,
}

const repositories: Repositories = {
  customerRepository: new CustomerRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
  bookingRepository: new BookingRepositoryImpl(),
  sourceRepository: new SourceRepositoryImpl(),
};

export const {
  customerRepository,
  userRepository,
  leadRepository,
  bookingRepository,
  sourceRepository,
} = repositories;
