import CreateTenantUserUseCaseImpl from './CreateTenantUserUseCaseImpl';
import DeleteTenantUserUseCaseImpl from './DeleteTenantUserUseCaseImpl';
import GetUserListUseCaseImpl from './GetTenantUserListUseCaseImpl';
import GetUserTenantUseCaseImpl from './GetTenantUserUseCaseImpl';
import { CreateTenantUserUseCase } from './interfaces/CreateTenantUserUseCase';
import { DeleteTenantUserUseCase } from './interfaces/DeleteTenantUserUseCase';
import { GetTenantUserListUseCase } from './interfaces/GetTenantUserListUseCase';
import { GetTenantUserUseCase } from './interfaces/GetTenantUserUseCase';
import { UpdateTenantUserUseCase } from './interfaces/UpdateTenantUserUseCase';
import UpdateTenantUserUseCaseImpl from './UpdateTenantUserUseCaseImpl';

interface UseCases {
  getTenantUserListUseCase: GetTenantUserListUseCase,
  createTenantUserUseCase: CreateTenantUserUseCase,
  getTenantUserUseCase: GetTenantUserUseCase,
  updateTenantUserUseCase: UpdateTenantUserUseCase,
  deleteTenantUserUseCase: DeleteTenantUserUseCase,
}

const useCases : UseCases = {
  getTenantUserListUseCase: new GetUserListUseCaseImpl(),
  createTenantUserUseCase: new CreateTenantUserUseCaseImpl(),
  getTenantUserUseCase: new GetUserTenantUseCaseImpl(),
  updateTenantUserUseCase: new UpdateTenantUserUseCaseImpl(),
  deleteTenantUserUseCase: new DeleteTenantUserUseCaseImpl(),
};

export const {
  getTenantUserListUseCase,
  createTenantUserUseCase,
  getTenantUserUseCase,
  updateTenantUserUseCase,
  deleteTenantUserUseCase,
} = useCases;
