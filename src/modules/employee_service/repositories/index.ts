// TODO: Declare repository objects which can be used in this service here

import EmployeeRepositoryImpl from './EmployeeRepositoryImpl';
import { EmployeeRepository } from './interfaces/EmployeeRepository';

interface Repositories {
  employeeRepository: EmployeeRepository,
}

const repositories : Repositories = {
  employeeRepository: new EmployeeRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  employeeRepository,
} = repositories;
