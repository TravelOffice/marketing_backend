import AuthorizationRepositoryImpl from './AuthorizationRepositoryImpl';
import { AuthorizationRepository } from './interfaces/AuthorizationRepository';
import { RolePermissionRepository } from './interfaces/RolePermissionRepository';
import { UserRepository } from './interfaces/UserRepository';
import RolePermissionRepositoryImpl from './RolePermissionRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  authorizationRepository: AuthorizationRepository,
  rolePermissionRepository: RolePermissionRepository,
  userRepository: UserRepository,
}

const repositories: Repositories = {
  authorizationRepository: new AuthorizationRepositoryImpl(),
  rolePermissionRepository: new RolePermissionRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  authorizationRepository,
  rolePermissionRepository,
  userRepository,
} = repositories;
