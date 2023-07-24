import ToursOperationRepositoryImpl from './ToursOperationRepositoryImpl';
import { ToursOperationRepository } from './interfaces/ToursOperationRepository';

interface Repositories {
  tourOperationRepository: ToursOperationRepository,
}

const repositories: Repositories = {
  tourOperationRepository: new ToursOperationRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  tourOperationRepository,
} = repositories;
