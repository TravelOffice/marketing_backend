import OrganizationRepositoryImpl from './OrganizationRepositoryImpl';
import { OrganizationRepository } from './interfaces/OrganizationRepository';

interface Repositories {
  organizationRepository: OrganizationRepository,
}

const repositories : Repositories = {
  organizationRepository: new OrganizationRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  organizationRepository,
} = repositories;
