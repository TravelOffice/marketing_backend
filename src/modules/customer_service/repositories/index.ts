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

interface Repositories {
  customerRepository: CustomerRepository,
  userRepository: UserRepository,
  cognitoUserRepository: CognitoUserRepository,
  leadRepository: LeadRepository,
  bookingRepository: BookingRepository,
}

const repositories : Repositories = {
  customerRepository: new CustomerRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  cognitoUserRepository: new CognitoUserRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
  bookingRepository: new BookingRepositoryImpl(),
};

export const {
  customerRepository,
  userRepository,
  cognitoUserRepository,
  leadRepository,
  bookingRepository,
} = repositories;
