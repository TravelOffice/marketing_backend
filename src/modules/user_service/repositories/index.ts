import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  userRepository: UserRepository,
}

const repositories : Repositories = {
  userRepository: new UserRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  userRepository,
} = repositories;
