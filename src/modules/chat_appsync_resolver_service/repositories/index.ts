import { ChatPlatformRepository } from './interfaces/ChatPlatformRepository';
import ChatPlatformRepositoryImpl from './ChatPlatformRepositoryImpl';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import { RolePermissionRepository } from './interfaces/RolePermissionRepository';
import RolePermissionRepositoryImpl from './RolePermissionRepositoryImpl';

interface Repositories {
  chatPlatformRepository: ChatPlatformRepository,
  rolePermissionRepository: RolePermissionRepository,
  userRepository: UserRepository,
}

const repositories: Repositories = {
  chatPlatformRepository: new ChatPlatformRepositoryImpl(),
  rolePermissionRepository: new RolePermissionRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

export const {
  chatPlatformRepository,
  rolePermissionRepository,
  userRepository,
} = repositories;
