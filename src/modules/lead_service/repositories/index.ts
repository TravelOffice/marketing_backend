// TODO: Declare repository objects which can be used in this service here

import { LeadRepository } from './interfaces/LeadRepository';
import { UserRepository } from './interfaces/UserRepository';
import { CognitoUserRepository } from './interfaces/CognitoUserRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import CognitoUserRepositoryImpl from './CognitoUserRepositoryImpl';

interface Repositories {
  leadRepository: LeadRepository,
  userRepository: UserRepository,
  cognitoUserRepository: CognitoUserRepository,
}

const repositories : Repositories = {
  leadRepository: new LeadRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  cognitoUserRepository: new CognitoUserRepositoryImpl(),
};

export const {
  leadRepository,
  userRepository,
  cognitoUserRepository,
} = repositories;
