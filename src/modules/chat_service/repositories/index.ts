// TODO: Declare repository objects which can be used in this service here

import ChatRepositoryImpl from './ChatRepositoryImpl';
import { ChatRepository } from './interfaces/ChatRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  chatRepository: ChatRepository,
  userRepository: UserRepository,
}

const repositories: Repositories = {
  chatRepository: new ChatRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

export const {
  chatRepository,
  userRepository,
} = repositories;
