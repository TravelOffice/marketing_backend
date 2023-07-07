import { LeadRepository } from './interfaces/LeadRepository';
import { UserRepository } from './interfaces/UserRepository';
import { CognitoUserRepository } from './interfaces/CognitoUserRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import CognitoUserRepositoryImpl from './CognitoUserRepositoryImpl';
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
  cognitoUserRepository: CognitoUserRepository,
  customerRepository: CustomerRepository,
  tourTemplateRepository: TourTemplateRepository,
  sourceRepository: SourceRepository,
  locationRepository: TourLocationRepository,
}

const repositories : Repositories = {
  leadRepository: new LeadRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  cognitoUserRepository: new CognitoUserRepositoryImpl(),
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
