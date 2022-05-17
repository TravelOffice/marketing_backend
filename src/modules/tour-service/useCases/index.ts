// TODO: Declare use cases which can be used in this service here

import GetToursUseCaseImpl from './GetToursUseCaseImpl';
import { GetToursUseCase } from './interfaces/GetToursUseCase';

interface UseCases {
  getToursUseCase: GetToursUseCase,
}

const useCases : UseCases = {
  getToursUseCase: new GetToursUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  getToursUseCase,
} = useCases;
