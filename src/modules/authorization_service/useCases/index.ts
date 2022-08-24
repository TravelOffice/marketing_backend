import CreateTenantRoleUseCaseImpl from './CreateTenantRoleUseCaseImpl';
import GetListGroupPermissionsUseCaseImpl from './GetListGroupPermissionsUseCaseImpl';
import GetListTenantRolesUseCaseImpl from './GetListTenantRolesUseCaseImpl';
import { CreateTenantRoleUseCase } from './interfaces/CreateTenantRoleUseCase';
import { GetListGroupPermissionsUseCase } from './interfaces/GetListGroupPermissionsUseCase';
import { GetListTenantRolesUseCase } from './interfaces/GetListTenantRolesUseCase';

interface UseCases {
  getListTenantRolesUseCase: GetListTenantRolesUseCase,
  createTenantRoleUseCase: CreateTenantRoleUseCase,
  getListGroupPermissionsUseCase: GetListGroupPermissionsUseCase,
}

const useCases: UseCases = {
  getListTenantRolesUseCase: new GetListTenantRolesUseCaseImpl(),
  createTenantRoleUseCase: new CreateTenantRoleUseCaseImpl(),
  getListGroupPermissionsUseCase: new GetListGroupPermissionsUseCaseImpl(),
};

export const {
  getListTenantRolesUseCase,
  createTenantRoleUseCase,
  getListGroupPermissionsUseCase,
} = useCases;
