import { CreateCustomerUseCase } from './interfaces/CreateCustomerUseCase';
import CreateCustomerUseCaseImpl from './CreateCustomerUseCaseImpl';
import { GetCustomerListUseCase } from './interfaces/GetCustomerListUseCase';
import GetCustomerListUseCaseImpl from './GetCustomerListUseCaseImpl';
import { ChangeCustomerAssigneeUseCase } from './interfaces/ChangeCustomerAssigneeUseCase';
import ChangeCustomerAssigneeUseCaseImpl from './ChangeCustomerAssigneeUseCaseImpl';
import { UpdateCustomerUseCase } from './interfaces/UpdateCustomerUseCase';
import UpdateCustomerUseCaseImpl from './UpdateCustomerUseCaseImpl';
import { DeleteCustomerUseCase } from './interfaces/DeleteCustomerUseCase';
import DeleteCustomerUseCaseImpl from './DeleteCustomerUseCaseImpl';
import { GetCustomerUseCase } from './interfaces/GetCustomerUseCase';
import GetCustomerUseCaseImpl from './GetCustomerUseCaseImpl';

interface UseCases {
  getCustomerUseCase: GetCustomerUseCase,
  createCustomerUseCase: CreateCustomerUseCase,
  updateCustomerUseCase: UpdateCustomerUseCase,
  deleteCustomerUseCase: DeleteCustomerUseCase,
  getCustomerListUseCase: GetCustomerListUseCase,
  changeCustomerAssigneeUseCase: ChangeCustomerAssigneeUseCase,
}

const useCases: UseCases = {
  getCustomerUseCase: new GetCustomerUseCaseImpl(),
  createCustomerUseCase: new CreateCustomerUseCaseImpl(),
  updateCustomerUseCase: new UpdateCustomerUseCaseImpl(),
  deleteCustomerUseCase: new DeleteCustomerUseCaseImpl(),
  getCustomerListUseCase: new GetCustomerListUseCaseImpl(),
  changeCustomerAssigneeUseCase: new ChangeCustomerAssigneeUseCaseImpl(),
};

export const {
  getCustomerUseCase,
  createCustomerUseCase,
  updateCustomerUseCase,
  deleteCustomerUseCase,
  getCustomerListUseCase,
  changeCustomerAssigneeUseCase,
} = useCases;
