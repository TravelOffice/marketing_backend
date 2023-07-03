// TODO: Declare repository objects which can be used in this service here

import TourLocationRepositoryImpl from './TourLocationRepositoryImpl';
import { TourLocationRepository } from './interfaces/TourLocationRepository';

interface Repositories {
  tourLocationRepository: TourLocationRepository,
}

const repositories : Repositories = {
  tourLocationRepository: new TourLocationRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  tourLocationRepository,
} = repositories;
