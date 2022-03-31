// TODO: Declare repository objects which can be used in this service here

import ZaloPageRepositoryImpl from './ZaloPageRepositoryImpl';
import { ZaloPageRepository } from './interfaces/ZaloPageRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  zaloPageRepository: ZaloPageRepository,
  userRepository: UserRepository,
}

const repositories : Repositories = {
  zaloPageRepository: new ZaloPageRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),

};

export const {
  zaloPageRepository,
  userRepository,
} = repositories;
