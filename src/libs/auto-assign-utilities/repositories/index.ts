import { SaleAssignmentRepository } from './interfaces/SaleAssignmentRepository';
import SaleAssignmentRepositoryImpl from './SaleAssignmentRepositoryImpl';

interface Repositories {
  saleAssignmentRepository: SaleAssignmentRepository,
}

const repositories: Repositories = {
  saleAssignmentRepository: new SaleAssignmentRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const { saleAssignmentRepository } = repositories;
