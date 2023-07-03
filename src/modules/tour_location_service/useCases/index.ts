// TODO: Declare use cases which can be used in this service here

import CreateTourLocationUseCaseImpl from './CreateTourLocationUseCaseImpl';
import DeleteTourLocationUseCaseImpl from './DeleteTourLocationUseCaseImpl';
import GetTourLocationListUseCaseImpl from './GetTourLocationListUseCaseImpl';
import GetTourLocationUseCaseImpl from './GetTourLocationUseCaseImpl';
import { CreateTourLocationUseCase } from './interfaces/CreateTourLocationUseCase';
import { DeleteTourLocationUseCase } from './interfaces/DeleteTourLocationUseCase';
import { GetTourLocationListUseCase } from './interfaces/GetTourLocationListUseCase';
import { GetTourLocationUseCase } from './interfaces/GetTourLocationUseCase';
import { UpdateTourLocationUseCase } from './interfaces/UpdateTourLocationUseCase';
import UpdateTourLocationUseCaseImpl from './UpdateTourLocationUseCaseImpl';

interface UseCases {
  getTourLocationListUseCase: GetTourLocationListUseCase,
  createTourLocationUseCase: CreateTourLocationUseCase,
  getTourLocationUseCase: GetTourLocationUseCase,
  updateTourLocationUseCase: UpdateTourLocationUseCase,
  deleteTourLocationUseCase: DeleteTourLocationUseCase,
}

const useCases : UseCases = {
  getTourLocationListUseCase: new GetTourLocationListUseCaseImpl(),
  createTourLocationUseCase: new CreateTourLocationUseCaseImpl(),
  getTourLocationUseCase: new GetTourLocationUseCaseImpl(),
  updateTourLocationUseCase: new UpdateTourLocationUseCaseImpl(),
  deleteTourLocationUseCase: new DeleteTourLocationUseCaseImpl(),
};

export const {
  getTourLocationListUseCase,
  createTourLocationUseCase,
  getTourLocationUseCase,
  updateTourLocationUseCase,
  deleteTourLocationUseCase,
} = useCases;
