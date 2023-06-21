// TODO: Declare repository objects which can be used in this service here

import DepartureTourRepositoryImpl from './DepartureTourRepositoryImpl';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';

interface Repositories {
  departureTourRepository : DepartureTourRepository,
}

const repositories : Repositories = {
  departureTourRepository: new DepartureTourRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  departureTourRepository,
} = repositories;
