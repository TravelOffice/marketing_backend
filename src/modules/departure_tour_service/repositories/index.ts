// TODO: Declare repository objects which can be used in this service here

import DepartureTourRepositoryImpl from './DepartureTourRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';
import { UserRepository } from './interfaces/UserRepository';

interface Repositories {
  departureTourRepository : DepartureTourRepository,
  userRepository: UserRepository,
}

const repositories : Repositories = {
  departureTourRepository: new DepartureTourRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  departureTourRepository,
  userRepository,
} = repositories;
