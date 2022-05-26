// TODO: Declare repository objects which can be used in this service here

import QuoteRepositoryImpl from './QuoteRepositoryImpl';
import { QuoteRepository } from './interfaces/QuoteRepository';

interface Repositories {
  quoteRepository: QuoteRepository,
}

const repositories : Repositories = {
  quoteRepository: new QuoteRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  quoteRepository,
} = repositories;
