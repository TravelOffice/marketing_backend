import CreateTenantRoleUseCaseImpl from './CreateTenantRoleUseCaseImpl';
import GetListPermissionsUseCaseImpl from './GetListPermissionsUseCaseImpl';
import GetListTenantRolesUseCaseImpl from './GetListTenantRolesUseCaseImpl';
import { CreateTenantRoleUseCase } from './interfaces/CreateTenantRoleUseCase';
import { GetListPermissionsUseCase } from './interfaces/GetListPermissionsUseCase';
import { GetListTenantRolesUseCase } from './interfaces/GetListTenantRolesUseCase';

interface UseCases {
  getListTenantRolesUseCase: GetListTenantRolesUseCase,
  createTenantRoleUseCase: CreateTenantRoleUseCase,
  getListPermissionsUseCase: GetListPermissionsUseCase,
}

const useCases: UseCases = {
  getListTenantRolesUseCase: new GetListTenantRolesUseCaseImpl(),
  createTenantRoleUseCase: new CreateTenantRoleUseCaseImpl(),
  getListPermissionsUseCase: new GetListPermissionsUseCaseImpl(),
};

export const {
  getListTenantRolesUseCase,
  createTenantRoleUseCase,
  getListPermissionsUseCase,
} = useCases;
