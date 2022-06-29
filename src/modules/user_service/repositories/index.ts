import { UserRepository } from './interfaces/UserRepository';
import { PageRepository } from './interfaces/PageRepository';
import PageRepositoryImpl from './PageRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  userRepository: UserRepository,
  pageRepository: PageRepository,
}

const repositories : Repositories = {
  userRepository: new UserRepositoryImpl(),
  pageRepository: new PageRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  userRepository,
  pageRepository,
} = repositories;
