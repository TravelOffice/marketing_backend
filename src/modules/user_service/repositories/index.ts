import { UserRepository } from './interfaces/UserRepository';
import { PageRepository } from './interfaces/PageRepository';
import PageRepositoryImpl from './PageRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import { TelegramRepository } from './interfaces/TelegramRepository';
import TelegramRepositoryImpl from './TelegramRepositoryImpl';
import { RolePermissionRepository } from './interfaces/RolePermissionRepository';
import RolePermissionRepositoryImpl from './RolePermissionRepositoryImpl';
import { SearchRepository } from './interfaces/SearchRepository';
import SearchRepositoryImpl from './SearchRepositoryImpl';

interface Repositories {
  userRepository: UserRepository,
  pageRepository: PageRepository,
  telegramRepository: TelegramRepository,
  rolePermissionRepository: RolePermissionRepository,
  searchRepository: SearchRepository,
}

const repositories: Repositories = {
  userRepository: new UserRepositoryImpl(),
  pageRepository: new PageRepositoryImpl(),
  telegramRepository: new TelegramRepositoryImpl(),
  rolePermissionRepository: new RolePermissionRepositoryImpl(),
  searchRepository: new SearchRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  userRepository,
  pageRepository,
  telegramRepository,
  rolePermissionRepository,
  searchRepository,
} = repositories;
