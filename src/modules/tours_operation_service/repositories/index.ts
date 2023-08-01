import ToursOperationRepositoryImpl from './ToursOperationRepositoryImpl';
import { ToursOperationRepository } from './interfaces/ToursOperationRepository';
import { SupplierRepository } from './interfaces/SupplierRepository';
import SupplierRepositoryImpl from './SupplierRepositoryImpl';
import { EstimationRepository } from './interfaces/EstimationRepository';
import EstimationRepositoryImpl from './EstimationRepositoryImpl';

interface Repositories {
  tourOperationRepository: ToursOperationRepository,
  supplierRepository: SupplierRepository,
  estimationRepository: EstimationRepository,
}

const repositories: Repositories = {
  tourOperationRepository: new ToursOperationRepositoryImpl(),
  supplierRepository: new SupplierRepositoryImpl(),
  estimationRepository: new EstimationRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  tourOperationRepository,
  supplierRepository,
  estimationRepository,
} = repositories;
