import { BaseDdbModel } from 'common-models';

export enum HTTP_VERB {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  ALL = 'ALL',
}

// DDB Model without indexes
export type RestrictedDDBModel<T extends BaseDdbModel> = Omit<T, 'pk' | 'sk' | 'lsi1' | 'lsi2' | 'lsi3' | 'lsi4' | 'lsi5'>;
// Type of sk is string
type TypeOfSk = BaseDdbModel['sk'];

export interface PermissionStatement {
  path: string,
  action?: HTTP_VERB,
}

export interface Permission {
  name: string,
  title: string,
  statements: Array<PermissionStatement>,
}

export interface DDBGroupPermission extends BaseDdbModel {
  permissions: Array<Permission>
}

export interface GroupPermission extends RestrictedDDBModel<DDBGroupPermission> {
  name?: TypeOfSk,
}

export interface DDBRole extends BaseDdbModel {
  permissions: Array<Permission>,
}

export interface Role extends RestrictedDDBModel<DDBRole> {
  name: TypeOfSk,
  isDefault?: boolean
}
