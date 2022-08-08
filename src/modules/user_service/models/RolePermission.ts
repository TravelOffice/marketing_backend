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
export type RestrictedDDBModel<T extends BaseDdbModel> = Omit<T, 'pk' | 'sk' | 'typeLsi'>;
// Type of sk is string
type TypeOfSk = BaseDdbModel['sk'];

export interface DDBPermission extends BaseDdbModel {
  path: string,
  action?: HTTP_VERB,
}

export interface Permission extends RestrictedDDBModel<DDBPermission> {
  name?: TypeOfSk,
}

export interface DDBRole extends BaseDdbModel {
  permissions: Array<Permission>,
}

export interface Role extends RestrictedDDBModel<DDBRole> {
  name: TypeOfSk,
}
