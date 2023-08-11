// TODO: Declare use cases which can be used in this service here

import CreateTourPostUseCaseImpl from './CreateTourPostUseCaseImpl';
import GetTourPostListUseCaseImpl from './GetTourPostListUseCaseImpl';
import GetTourPostUseCaseImpl from './GetTourPostUseCaseImpl';
import { CreateTourPostUseCase } from './interfaces/CreateTourPostUseCase';
import { GetTourPostListUseCase } from './interfaces/GetTourPostListUseCase';
import { GetTourPostUseCase } from './interfaces/GetTourPostUseCase';
import { UpdateTourPostUseCase } from './interfaces/UpdateTourPostUseCase';
import UpdateTourPostUseCaseImpl from './UpdateTourPostUseCaseImpl';

interface UseCases {
  getTourPostListUseCase: GetTourPostListUseCase,
  createTourPostUseCase: CreateTourPostUseCase,
  getTourPostUseCase: GetTourPostUseCase,
  updateTourPostUseCase: UpdateTourPostUseCase,
}

const useCases : UseCases = {
  getTourPostListUseCase: new GetTourPostListUseCaseImpl(),
  createTourPostUseCase: new CreateTourPostUseCaseImpl(),
  getTourPostUseCase: new GetTourPostUseCaseImpl(),
  updateTourPostUseCase: new UpdateTourPostUseCaseImpl(),
};

export const {
  getTourPostListUseCase,
  createTourPostUseCase,
  getTourPostUseCase,
  updateTourPostUseCase,
} = useCases;
