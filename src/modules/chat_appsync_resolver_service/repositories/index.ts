import { ChatPlatformRepository } from './interfaces/ChatPlatformRepository';
import ChatPlatformRepositoryImpl from './ChatPlatformRepositoryImpl';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import { RolePermissionRepository } from './interfaces/RolePermissionRepository';
import RolePermissionRepositoryImpl from './RolePermissionRepositoryImpl';
import { ChatSessionRepository } from './interfaces/ChatSessionRepository';
import ChatSessionRepositoryImpl from './ChatSessionRepositoryImpl';

interface Repositories {
  chatPlatformRepository: ChatPlatformRepository,
  rolePermissionRepository: RolePermissionRepository,
  userRepository: UserRepository,
  chatSessionRepository: ChatSessionRepository,
}

const repositories: Repositories = {
  chatPlatformRepository: new ChatPlatformRepositoryImpl(),
  rolePermissionRepository: new RolePermissionRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  chatSessionRepository: new ChatSessionRepositoryImpl(),
};

export const {
  chatPlatformRepository,
  rolePermissionRepository,
  userRepository,
  chatSessionRepository,
} = repositories;
