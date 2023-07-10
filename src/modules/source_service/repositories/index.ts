// TODO: Declare repository objects which can be used in this service here

import SourceRepositoryImpl from './SourceRepositoryImpl';
import { SourceRepository } from './interfaces/SourceRepository';

interface Repositories {
  sourceRepository: SourceRepository,
}

const repositories : Repositories = {
  sourceRepository: new SourceRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  sourceRepository,
} = repositories;
