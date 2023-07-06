import BookingRepositoryImpl from './BookingRepositoryImpl';
import CustomerRepositoryImpl from './CustomerRepositoryImpl';
import { BookingRepository } from './interfaces/BookingRepository';
import { CustomerRepository } from './interfaces/CustomerRepository';
import { LeadRepository } from './interfaces/LeadRepository';
import { TourTemplateRepository } from './interfaces/TourTemplateRepository';
import { UserRepository } from './interfaces/UserRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import TourTemplateRepositoryImpl from './TourTemplateRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  bookingRepository: BookingRepository,
  userRepository: UserRepository,
  customerRepository: CustomerRepository,
  leadRepository: LeadRepository,
  tourTemplateRepository: TourTemplateRepository,
}

const repositories: Repositories = {
  bookingRepository: new BookingRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  customerRepository: new CustomerRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
  tourTemplateRepository: new TourTemplateRepositoryImpl(),
};

export const {
  bookingRepository,
  userRepository,
  customerRepository,
  leadRepository,
  tourTemplateRepository,
} = repositories;
