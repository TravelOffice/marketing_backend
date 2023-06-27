import { CustomerRepository } from './interfaces/CustomerRepository';
import { UserRepository } from './interfaces/UserRepository';
import { CognitoUserRepository } from './interfaces/CognitoUserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import CognitoUserRepositoryImpl from './CognitoUserRepositoryImpl';
import CustomerRepositoryImpl from './CustomerRepositoryImpl';

interface Repositories {
  customerRepository: CustomerRepository,
  userRepository: UserRepository,
  cognitoUserRepository: CognitoUserRepository,
}

const repositories : Repositories = {
  customerRepository: new CustomerRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  cognitoUserRepository: new CognitoUserRepositoryImpl(),
};

export const {
  customerRepository,
  userRepository,
  cognitoUserRepository,
} = repositories;
