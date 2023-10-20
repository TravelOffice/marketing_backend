// TODO: Declare repository objects which can be used in this service here

import SessionRepositoryImpl from './SessionRepositoryImpl';
import { SessionRepository } from './interfaces/SessionRepository';

interface Repositories {
  sessionRepository: SessionRepository,
}

const repositories: Repositories = {
  sessionRepository: new SessionRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  sessionRepository,
} = repositories;
