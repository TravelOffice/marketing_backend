import AuthorizationRepositoryImpl from './AuthorizationRepositoryImpl';
import { AuthorizationRepository } from './interfaces/AuthorizationRepository';

interface Repositories {
  authorizationRepository: AuthorizationRepository,
}

const repositories: Repositories = {
  authorizationRepository: new AuthorizationRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  authorizationRepository,
} = repositories;
