// TODO: Declare use cases which can be used in this service here

import CreateEmployeeUseCaseImpl from './CreateEmployeeUseCaseImpl';
import DeleteEmployeeUseCaseImpl from './DeleteEmployeeUseCaseImpl';
import GetEmployeeListUseCaseImpl from './GetEmployeeListUseCaseImpl';
import GetEmployeeUseCaseImpl from './GetEmployeeUseCaseImpl';
import { CreateEmployeeUseCase } from './interfaces/CreateEmployeeUseCase';
import { DeleteEmployeeUseCase } from './interfaces/DeleteEmployeeUseCase';
import { GetEmployeeListUseCase } from './interfaces/GetEmployeeListUseCase';
import { GetEmployeeUseCase } from './interfaces/GetEmployeeUseCase';
import { UpdateEmployeeUseCase } from './interfaces/UpdateEmployeeUseCase';
import UpdateEmployeeUseCaseImpl from './UpdateEmployeeUseCaseImpl';

interface UseCases {
  getEmployeeListUseCase: GetEmployeeListUseCase,
  createEmployeeUseCase: CreateEmployeeUseCase,
  getEmployeeUseCase: GetEmployeeUseCase,
  updateEmployeeUseCase: UpdateEmployeeUseCase,
  deleteEmployeeUseCase: DeleteEmployeeUseCase,
}

const useCases : UseCases = {
  getEmployeeListUseCase: new GetEmployeeListUseCaseImpl(),
  createEmployeeUseCase: new CreateEmployeeUseCaseImpl(),
  getEmployeeUseCase: new GetEmployeeUseCaseImpl(),
  updateEmployeeUseCase: new UpdateEmployeeUseCaseImpl(),
  deleteEmployeeUseCase: new DeleteEmployeeUseCaseImpl(),
};

export const {
  getEmployeeListUseCase,
  createEmployeeUseCase,
  getEmployeeUseCase,
  updateEmployeeUseCase,
  deleteEmployeeUseCase,
} = useCases;
