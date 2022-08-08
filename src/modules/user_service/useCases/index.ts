import CreateTenantUserUseCaseImpl from './CreateTenantUserUseCaseImpl';
import DeleteTenantUserUseCaseImpl from './DeleteTenantUserUseCaseImpl';
import GetLinkedPagesUseCaseImpl from './GetLinkedPagesUseCaseImpl';
import GetUserListUseCaseImpl from './GetTenantUserListUseCaseImpl';
import GetUserTenantUseCaseImpl from './GetTenantUserUseCaseImpl';
import GetTenantUserWithPermissionUseCaseImpl from './GetTenantUserWithPermissionUseCaseImpl';
import { CreateTenantUserUseCase } from './interfaces/CreateTenantUserUseCase';
import { DeleteTenantUserUseCase } from './interfaces/DeleteTenantUserUseCase';
import { GetLinkedPagesUseCase } from './interfaces/GetLinkedPagesUserUseCase';
import { GetTenantUserListUseCase } from './interfaces/GetTenantUserListUseCase';
import { GetTenantUserUseCase } from './interfaces/GetTenantUserUseCase';
import { GetTenantUserWithPermissionUseCase } from './interfaces/GetTenantUserWithPermissionUseCase';
import { UnlinkPageUseCase } from './interfaces/UnlinkPageUseCase';
import { UpdateTenantUserUseCase } from './interfaces/UpdateTenantUserUseCase';
import UnlinkPageUseCaseImpl from './UnlinkPageUseCaseImpl';
import UpdateTenantUserUseCaseImpl from './UpdateTenantUserUseCaseImpl';

interface UseCases {
  getTenantUserListUseCase: GetTenantUserListUseCase,
  createTenantUserUseCase: CreateTenantUserUseCase,
  getTenantUserUseCase: GetTenantUserUseCase,
  getTenantUserWithPermissionUseCase: GetTenantUserWithPermissionUseCase,
  updateTenantUserUseCase: UpdateTenantUserUseCase,
  deleteTenantUserUseCase: DeleteTenantUserUseCase,
  getLinkedPageUseCase: GetLinkedPagesUseCase,
  unlinkPageUsecase: UnlinkPageUseCase,
}

const useCases : UseCases = {
  getTenantUserListUseCase: new GetUserListUseCaseImpl(),
  createTenantUserUseCase: new CreateTenantUserUseCaseImpl(),
  getTenantUserUseCase: new GetUserTenantUseCaseImpl(),
  getTenantUserWithPermissionUseCase: new GetTenantUserWithPermissionUseCaseImpl(),
  updateTenantUserUseCase: new UpdateTenantUserUseCaseImpl(),
  deleteTenantUserUseCase: new DeleteTenantUserUseCaseImpl(),
  getLinkedPageUseCase: new GetLinkedPagesUseCaseImpl(),
  unlinkPageUsecase: new UnlinkPageUseCaseImpl(),
};

export const {
  getTenantUserListUseCase,
  createTenantUserUseCase,
  getTenantUserUseCase,
  getTenantUserWithPermissionUseCase,
  updateTenantUserUseCase,
  deleteTenantUserUseCase,
  getLinkedPageUseCase,
  unlinkPageUsecase,
} = useCases;
