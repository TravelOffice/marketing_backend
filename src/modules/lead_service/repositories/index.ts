import { LeadRepository } from './interfaces/LeadRepository';
import { UserRepository } from './interfaces/UserRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import { CustomerRepository } from './interfaces/CustomerRepository';
import CustomerRepositoryImpl from './CustomerRepositoryImpl';
import { TourTemplateRepository } from './interfaces/TourTemplateRepository';
import TourTemplateRepositoryImpl from './TourTemplateRepositoryImpl';
import { SourceRepository } from './interfaces/SourceRepository';
import SourceRepositoryImpl from './SourceRepositoryImpl';
import { TourLocationRepository } from './interfaces/TourLocationRepository';
import TourLocationRepositoryImpl from './TourLocationRepositoryImpl';

interface Repositories {
  leadRepository: LeadRepository,
  userRepository: UserRepository,
  customerRepository: CustomerRepository,
  tourTemplateRepository: TourTemplateRepository,
  sourceRepository: SourceRepository,
  locationRepository: TourLocationRepository,
}

const repositories: Repositories = {
  leadRepository: new LeadRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  customerRepository: new CustomerRepositoryImpl(),
  tourTemplateRepository: new TourTemplateRepositoryImpl(),
  sourceRepository: new SourceRepositoryImpl(),
  locationRepository: new TourLocationRepositoryImpl(),
};

export const {
  leadRepository,
  userRepository,
  customerRepository,
  tourTemplateRepository,
  sourceRepository,
  locationRepository,
} = repositories;
