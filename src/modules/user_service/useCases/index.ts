import CreateTenantUserUseCaseImpl from './CreateTenantUserUseCaseImpl';
import DeleteTenantUserUseCaseImpl from './DeleteTenantUserUseCaseImpl';
import GetLinkedPagesUseCaseImpl from './GetLinkedPagesUseCaseImpl';
import GetUserListUseCaseImpl from './GetTenantUserListUseCaseImpl';
import GetUserTenantUseCaseImpl from './GetTenantUserUseCaseImpl';
import { CreateTenantUserUseCase } from './interfaces/CreateTenantUserUseCase';
import { DeleteTenantUserUseCase } from './interfaces/DeleteTenantUserUseCase';
import { GetLinkedPagesUseCase } from './interfaces/GetLinkedPagesUserUseCase';
import { GetTenantUserListUseCase } from './interfaces/GetTenantUserListUseCase';
import { GetTenantUserUseCase } from './interfaces/GetTenantUserUseCase';
import { UnlinkPageUseCase } from './interfaces/UnlinkPageUseCase';
import { UpdateTenantUserUseCase } from './interfaces/UpdateTenantUserUseCase';
import UnlinkPageUseCaseImpl from './UnlinkPageUseCaseImpl';
import UpdateTenantUserUseCaseImpl from './UpdateTenantUserUseCaseImpl';

interface UseCases {
  getTenantUserListUseCase: GetTenantUserListUseCase,
  createTenantUserUseCase: CreateTenantUserUseCase,
  getTenantUserUseCase: GetTenantUserUseCase,
  updateTenantUserUseCase: UpdateTenantUserUseCase,
  deleteTenantUserUseCase: DeleteTenantUserUseCase,
  getLinkedPageUseCase: GetLinkedPagesUseCase,
  unlinkPageUsecase: UnlinkPageUseCase,
}

const useCases : UseCases = {
  getTenantUserListUseCase: new GetUserListUseCaseImpl(),
  createTenantUserUseCase: new CreateTenantUserUseCaseImpl(),
  getTenantUserUseCase: new GetUserTenantUseCaseImpl(),
  updateTenantUserUseCase: new UpdateTenantUserUseCaseImpl(),
  deleteTenantUserUseCase: new DeleteTenantUserUseCaseImpl(),
  getLinkedPageUseCase: new GetLinkedPagesUseCaseImpl(),
  unlinkPageUsecase: new UnlinkPageUseCaseImpl(),
};

export const {
  getTenantUserListUseCase,
  createTenantUserUseCase,
  getTenantUserUseCase,
  updateTenantUserUseCase,
  deleteTenantUserUseCase,
  getLinkedPageUseCase,
  unlinkPageUsecase,
} = useCases;
