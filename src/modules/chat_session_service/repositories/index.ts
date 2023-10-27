import ChatRepositoryImpl from './ChatRepositoryImpl';
import ChatSessionRepositoryImpl from './ChatSessionRepositoryImpl';
import { ChatRepository } from './interfaces/ChatRepository';
import { ChatSessionRepository } from './interfaces/ChatSessionRepository';

interface Repositories {
  chatSessionRepository: ChatSessionRepository,
  chatRepository: ChatRepository,
}

const repositories: Repositories = {
  chatSessionRepository: new ChatSessionRepositoryImpl(),
  chatRepository: new ChatRepositoryImpl(),
};

export const {
  chatSessionRepository,
  chatRepository,
} = repositories;
