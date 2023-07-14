// TODO: Declare repository objects which can be used in this service here

import { SupplierRepository } from './interfaces/SupplierRepository';
import SupplierRepositoryImpl from './SupplierRepositoryImpl';

interface Repositories {
  supplierRepository: SupplierRepository;
}

const repositories: Repositories = {
  supplierRepository: new SupplierRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const { supplierRepository } = repositories;
