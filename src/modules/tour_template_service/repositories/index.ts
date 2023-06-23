// TODO: Declare repository objects which can be used in this service here

import TourTemplateRepositoryImpl from './TourTemplateRepositoryImpl';
import { TourTemplateRepository } from './interfaces/TourTemplateRepository';

interface Repositories {
  tourTemplateRepository: TourTemplateRepository;
}

const repositories: Repositories = {
  tourTemplateRepository: new TourTemplateRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const { tourTemplateRepository } = repositories;
