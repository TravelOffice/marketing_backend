import CreateTenantRoleUseCaseImpl from './CreateTenantRoleUseCaseImpl';
import DeleteTenantUserUseCaseImpl from './DeleteTenantRoleUseCaseImpl';
import GetListGroupPermissionsUseCaseImpl from './GetListGroupPermissionsUseCaseImpl';
import GetListTenantRolesUseCaseImpl from './GetListTenantRolesUseCaseImpl';
import { CreateTenantRoleUseCase } from './interfaces/CreateTenantRoleUseCase';
import { DeleteTenantRoleUseCase } from './interfaces/DeleteTenantRoleUseCase';
import { GetListGroupPermissionsUseCase } from './interfaces/GetListGroupPermissionsUseCase';
import { GetListTenantRolesUseCase } from './interfaces/GetListTenantRolesUseCase';
import { UpdateTenantRoleUseCase } from './interfaces/UpdateTenantRoleUseCase';
import UpdateTenantUserUseCaseImpl from './UpdateTenantRoleUseCaseImpl';

interface UseCases {
  getListTenantRolesUseCase: GetListTenantRolesUseCase,
  createTenantRoleUseCase: CreateTenantRoleUseCase,
  updateTenantRoleUseCase: UpdateTenantRoleUseCase,
  deleteTenantRoleUseCase: DeleteTenantRoleUseCase,
  getListGroupPermissionsUseCase: GetListGroupPermissionsUseCase,
}

const useCases: UseCases = {
  getListTenantRolesUseCase: new GetListTenantRolesUseCaseImpl(),
  createTenantRoleUseCase: new CreateTenantRoleUseCaseImpl(),
  updateTenantRoleUseCase: new UpdateTenantUserUseCaseImpl(),
  deleteTenantRoleUseCase: new DeleteTenantUserUseCaseImpl(),
  getListGroupPermissionsUseCase: new GetListGroupPermissionsUseCaseImpl(),
};

export const {
  getListTenantRolesUseCase,
  createTenantRoleUseCase,
  updateTenantRoleUseCase,
  deleteTenantRoleUseCase,
  getListGroupPermissionsUseCase,
} = useCases;
