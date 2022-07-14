// TODO: Declare repository objects which can be used in this service here

import FacebookPageRepositoryImpl from './FacebookPageRepositoryImpl';
import { FacebookPageRepository } from './interfaces/FacebookPageRepository';
import { UserRepository } from './interfaces/UserRepository';
import { ZaloPageRepository } from './interfaces/ZaloPageRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import ZaloPageRepositoryImpl from './ZaloPageRepositoryImpl';

interface Repositories {
  facebookPageRepository: FacebookPageRepository,
  zaloPageRepository: ZaloPageRepository,
  userRepository: UserRepository,
}

const repositories : Repositories = {
  facebookPageRepository: new FacebookPageRepositoryImpl(),
  zaloPageRepository: new ZaloPageRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  facebookPageRepository,
  zaloPageRepository,
  userRepository,
} = repositories;
