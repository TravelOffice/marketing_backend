import { MessageRepository } from './interfaces/MessageRepository';
import MessageRepositoryImpl from './MessageRepositoryImpl';
import { PageRepository } from './interfaces/PageRepository';
import PageRepositoryImpl from './PageRepositoryImpl';

interface Repositories {
  messageRepository: MessageRepository,
  pageRepository: PageRepository,
}

const repositories: Repositories = {
  messageRepository: new MessageRepositoryImpl(),
  pageRepository: new PageRepositoryImpl(),
};

export const {
  messageRepository,
  pageRepository,
} = repositories;
