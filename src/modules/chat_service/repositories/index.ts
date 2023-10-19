import ChatRepositoryImpl from './ChatRepositoryImpl';
import ChatSessionRepositoryImpl from './ChatSessionRepositoryImpl';
import PageRepositoryImpl from './PageRepositoryImpl';
import TenantRepositoryImpl from './TenantRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import { ChatRepository } from './interfaces/ChatRepository';
import { ChatSessionRepository } from './interfaces/ChatSessionRepository';
import { PageRepository } from './interfaces/PageRepository';
import { TenantRepository } from './interfaces/TenantRepository';
import { UserRepository } from './interfaces/UserRepository';

interface Repositories {
  chatRepository: ChatRepository,
  userRepository: UserRepository,
  tenantRepository: TenantRepository,
  pageRepository: PageRepository,
  chatSessionRepository: ChatSessionRepository,
}

const repositories: Repositories = {
  chatRepository: new ChatRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  tenantRepository: new TenantRepositoryImpl(),
  pageRepository: new PageRepositoryImpl(),
  chatSessionRepository: new ChatSessionRepositoryImpl(),
};

export const {
  chatRepository,
  userRepository,
  tenantRepository,
  pageRepository,
  chatSessionRepository,
} = repositories;
