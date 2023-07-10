import { CustomerRepository } from './interfaces/CustomerRepository';
import { UserRepository } from './interfaces/UserRepository';
import { CognitoUserRepository } from './interfaces/CognitoUserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import CognitoUserRepositoryImpl from './CognitoUserRepositoryImpl';
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
  cognitoUserRepository: CognitoUserRepository,
  leadRepository: LeadRepository,
  bookingRepository: BookingRepository,
  sourceRepository: SourceRepository,
}

const repositories : Repositories = {
  customerRepository: new CustomerRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  cognitoUserRepository: new CognitoUserRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
  bookingRepository: new BookingRepositoryImpl(),
  sourceRepository: new SourceRepositoryImpl(),
};

export const {
  customerRepository,
  userRepository,
  cognitoUserRepository,
  leadRepository,
  bookingRepository,
  sourceRepository,
} = repositories;
