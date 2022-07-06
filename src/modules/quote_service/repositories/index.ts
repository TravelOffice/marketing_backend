// TODO: Declare repository objects which can be used in this service here

import { LeadRepository } from './interfaces/LeadRepository';
import { QuoteRepository } from './interfaces/QuoteRepository';
import { UserRepository } from './interfaces/UserRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import QuoteRepositoryImpl from './QuoteRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  quoteRepository: QuoteRepository,
  leadRepository: LeadRepository,
  userRepository: UserRepository,
}

const repositories: Repositories = {
  quoteRepository: new QuoteRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

export const {
  quoteRepository,
  leadRepository,
  userRepository,
} = repositories;
