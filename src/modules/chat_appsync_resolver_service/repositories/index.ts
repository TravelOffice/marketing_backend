// TODO: Declare repository objects which can be used in this service here

import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';
import FbMessagePlatformRepositoryImpl from './FbMessagePlatformRepositoryImpl';
import { ZaloMessagePlatformRepository } from './interfaces/ZaloMessagePlatformRepository';
import ZaloMessagePlatformRepositoryImpl from './ZaloMessagePlatformRepositoryImpl';
import { ChatPlatformRepository } from './interfaces/ChatPlatformRepository';
import ChatPlatformRepositoryImpl from './ChatPlatformRepositoryImpl';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import { RolePermissionRepository } from './interfaces/RolePermissionRepository';
import RolePermissionRepositoryImpl from './RolePermissionRepositoryImpl';

interface Repositories {
  fbMessagePlatformRepository: FbMessagePlatformRepository,
  zaloMessagePlatformRepository: ZaloMessagePlatformRepository,
  chatPlatformRepository: ChatPlatformRepository,
  rolePermissionRepository: RolePermissionRepository,
  userRepository: UserRepository,
}

const repositories: Repositories = {
  fbMessagePlatformRepository: new FbMessagePlatformRepositoryImpl(),
  zaloMessagePlatformRepository: new ZaloMessagePlatformRepositoryImpl(),
  chatPlatformRepository: new ChatPlatformRepositoryImpl(),
  rolePermissionRepository: new RolePermissionRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

export const {
  fbMessagePlatformRepository,
  zaloMessagePlatformRepository,
  chatPlatformRepository,
  rolePermissionRepository,
  userRepository,
} = repositories;
