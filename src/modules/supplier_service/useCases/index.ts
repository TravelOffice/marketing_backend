// TODO: Declare use cases which can be used in this service here

import CreateSupplierUseCaseImpl from './CreateSupplierUseCaseImpl';
import DeleteSupplierUseCaseImpl from './DeleteSupplierUseCaseImpl';
import GetSupplierListUseCaseImpl from './GetSupplierListUseCaseImpl';
import GetSupplierUseCaseImpl from './GetSupplierUseCaseImpl';
import { CreateSupplierUseCase } from './interfaces/CreateSupplierUseCase';
import { DeleteSupplierUseCase } from './interfaces/DeleteSupplierUseCase';
import { GetSupplierListUseCase } from './interfaces/GetSupplierListUseCase';
import { GetSupplierUseCase } from './interfaces/GetSupplierUseCase';
import { UpdateSupplierUseCase } from './interfaces/UpdateSupplierUseCase';
import UpdateSupplierUseCaseImpl from './UpdateSupplierUseCaseImpl';

interface UseCases {
  getSupplierListUseCase: GetSupplierListUseCase;
  createSupplierUseCase: CreateSupplierUseCase;
  getSupplierUseCase: GetSupplierUseCase;
  updateSupplierUseCase: UpdateSupplierUseCase;
  deleteSupplierUseCase: DeleteSupplierUseCase;
}

const useCases: UseCases = {
  getSupplierListUseCase: new GetSupplierListUseCaseImpl(),
  createSupplierUseCase: new CreateSupplierUseCaseImpl(),
  getSupplierUseCase: new GetSupplierUseCaseImpl(),
  updateSupplierUseCase: new UpdateSupplierUseCaseImpl(),
  deleteSupplierUseCase: new DeleteSupplierUseCaseImpl(),
};

export const {
  getSupplierListUseCase,
  createSupplierUseCase,
  getSupplierUseCase,
  updateSupplierUseCase,
  deleteSupplierUseCase,
} = useCases;
