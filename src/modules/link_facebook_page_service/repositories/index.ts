// TODO: Declare repository objects which can be used in this service here

import FacebookPageRepositoryImpl from './FacebookPageRepositoryImpl';
import { FacebookPageRepository } from './interfaces/FacebookPageRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  facebookPageRepository: FacebookPageRepository,
  userRepository: UserRepository,
}

const repositories : Repositories = {
  facebookPageRepository: new FacebookPageRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  facebookPageRepository,
  userRepository,
} = repositories;
