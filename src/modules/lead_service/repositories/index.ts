import { LeadRepository } from './interfaces/LeadRepository';
import { UserRepository } from './interfaces/UserRepository';
import { CognitoUserRepository } from './interfaces/CognitoUserRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import CognitoUserRepositoryImpl from './CognitoUserRepositoryImpl';
import { CustomerRepository } from './interfaces/CustomerRepository';
import CustomerRepositoryImpl from './CustomerRepositoryImpl';

interface Repositories {
  leadRepository: LeadRepository,
  userRepository: UserRepository,
  cognitoUserRepository: CognitoUserRepository,
  customerRepository: CustomerRepository,
}

const repositories : Repositories = {
  leadRepository: new LeadRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  cognitoUserRepository: new CognitoUserRepositoryImpl(),
  customerRepository: new CustomerRepositoryImpl(),
};

export const {
  leadRepository,
  userRepository,
  customerRepository,
} = repositories;
