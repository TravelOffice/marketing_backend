// TODO: Declare repository objects which can be used in this service here

import QuoteRepositoryImpl from './QuoteRepositoryImpl';
import { QuoteRepository } from './interfaces/QuoteRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  quoteRepository: QuoteRepository,
  userRepository: UserRepository,
}

const repositories : Repositories = {
  quoteRepository: new QuoteRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  quoteRepository,
  userRepository,
} = repositories;
