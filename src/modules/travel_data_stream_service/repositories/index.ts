import HistoryRepositoryImpl from './HistoryRepositoryImpl';
import { HistoryRepository } from './interfaces/HistoryRepository';

interface Repositories {
  historyRepository: HistoryRepository,
}

const repositories: Repositories = {
  historyRepository: new HistoryRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  historyRepository,
} = repositories;
