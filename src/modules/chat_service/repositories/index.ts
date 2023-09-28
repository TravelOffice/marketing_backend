// TODO: Declare repository objects which can be used in this service here

import ChatRepositoryImpl from './ChatRepositoryImpl';
import { ChatRepository } from './interfaces/ChatRepository';
import { TenantRepository } from './interfaces/TenantRepository';
import { UserRepository } from './interfaces/UserRepository';
import TenantRepositoryImpl from './TenantRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import { PageRepository } from './interfaces/PageRepository';
import PageRepositoryImpl from './PageRepositoryImpl';

interface Repositories {
  chatRepository: ChatRepository,
  userRepository: UserRepository,
  tenantRepository: TenantRepository,
  pageRepository: PageRepository,
}

const repositories: Repositories = {
  chatRepository: new ChatRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  tenantRepository: new TenantRepositoryImpl(),
  pageRepository: new PageRepositoryImpl(),
};

export const {
  chatRepository,
  userRepository,
  tenantRepository,
  pageRepository,
} = repositories;
