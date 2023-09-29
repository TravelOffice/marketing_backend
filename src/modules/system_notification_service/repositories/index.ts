import { UserDeviceSessionRepositoryImpl } from './UserDeviceSessionRepositoryImpl';
import { UserDeviceSessionRepository } from './interfaces/UserDeviceSessionRepository';

interface Repositories {
  userDeviceSessionRepository: UserDeviceSessionRepository,
}

const repositories: Repositories = {
  userDeviceSessionRepository: new UserDeviceSessionRepositoryImpl(),
};

export const {
  userDeviceSessionRepository,
} = repositories;
