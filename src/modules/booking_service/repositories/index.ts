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
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';
import DepartureTourRepositoryImpl from './DepartureTourRepositoryImpl';
import { SupplierRepository } from './interfaces/SupplierRepository';
import SupplierRepositoryImpl from './SupplierRepositoryImpl';
import { EstimationRepository } from './interfaces/EstimationRepository';
import EstimationRepositoryImpl from './EstimationRepositoryImpl';

interface Repositories {
  bookingRepository: BookingRepository,
  userRepository: UserRepository,
  customerRepository: CustomerRepository,
  leadRepository: LeadRepository,
  tourTemplateRepository: TourTemplateRepository,
  sourceRepository: SourceRepository,
  departureTourRepository: DepartureTourRepository,
  supplierRepository: SupplierRepository,
  estimationRepository: EstimationRepository,
}

const repositories: Repositories = {
  bookingRepository: new BookingRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  customerRepository: new CustomerRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
  tourTemplateRepository: new TourTemplateRepositoryImpl(),
  sourceRepository: new SourceRepositoryImpl(),
  departureTourRepository: new DepartureTourRepositoryImpl(),
  supplierRepository: new SupplierRepositoryImpl(),
  estimationRepository: new EstimationRepositoryImpl(),
};

export const {
  bookingRepository,
  userRepository,
  customerRepository,
  leadRepository,
  tourTemplateRepository,
  sourceRepository,
  departureTourRepository,
  supplierRepository,
  estimationRepository,
} = repositories;
