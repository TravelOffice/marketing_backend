import BookingRepositoryImpl from './BookingRepositoryImpl';
import CustomerRepositoryImpl from './CustomerRepositoryImpl';
import { BookingRepository } from './interfaces/BookingRepository';
import { CustomerRepository } from './interfaces/CustomerRepository';
import { LeadRepository } from './interfaces/LeadRepository';
import { SourceRepository } from './interfaces/SourceRepository';
import { TourTemplateRepository } from './interfaces/TourTemplateRepository';
import { UserRepository } from './interfaces/UserRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import SourceRepositoryImpl from './SourceRepositoryImpl';
import TourTemplateRepositoryImpl from './TourTemplateRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  bookingRepository: BookingRepository,
  userRepository: UserRepository,
  customerRepository: CustomerRepository,
  leadRepository: LeadRepository,
  tourTemplateRepository: TourTemplateRepository,
  sourceRepository: SourceRepository,
}

const repositories: Repositories = {
  bookingRepository: new BookingRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  customerRepository: new CustomerRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
  tourTemplateRepository: new TourTemplateRepositoryImpl(),
  sourceRepository: new SourceRepositoryImpl(),
};

export const {
  bookingRepository,
  userRepository,
  customerRepository,
  leadRepository,
  tourTemplateRepository,
  sourceRepository,
} = repositories;
