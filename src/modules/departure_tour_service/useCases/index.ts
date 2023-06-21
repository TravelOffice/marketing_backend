import CreateDepartureTourUseCaseImpl from './CreateDepartureTourUseCaseImpl';
import DeleteDepartureTourUseCaseImpl from './DeleteDepartureTourUseCaseImpl';
import GetDepartureTourListUseCaseImpl from './GetDepartureTourListUseCaseImpl';
import GetDepartureTourUseCaseImpl from './GetDepartureTourUseCaseImpl';
import { CreateDepartureTourUseCase } from './interfaces/CreateDepartureTourUseCase';
import { DeleteDepartureTourUseCase } from './interfaces/DeleteDepartureTourUseCase';
import { GetDepartureTourListUseCase } from './interfaces/GetDepartureTourListUseCase';
import { GetDepartureTourUseCase } from './interfaces/GetDepartureTourUseCase';
import { UpdateDepartureTourUseCase } from './interfaces/UpdateDepartureTourUseCase';
import UpdateDepartureTourUseCaseImpl from './UpdateDepartureTourUseCaseImpl';

interface UseCases {
  getDepartureTourListUseCase: GetDepartureTourListUseCase,
  createDepartureTourUseCase: CreateDepartureTourUseCase,
  getDepartureTourUseCase: GetDepartureTourUseCase,
  updateDepartureTourUseCase: UpdateDepartureTourUseCase,
  deleteDepartureTourUseCase: DeleteDepartureTourUseCase,
}

const useCases : UseCases = {
  getDepartureTourListUseCase: new GetDepartureTourListUseCaseImpl(),
  createDepartureTourUseCase: new CreateDepartureTourUseCaseImpl(),
  getDepartureTourUseCase: new GetDepartureTourUseCaseImpl(),
  updateDepartureTourUseCase: new UpdateDepartureTourUseCaseImpl(),
  deleteDepartureTourUseCase: new DeleteDepartureTourUseCaseImpl(),
};

export const {
  getDepartureTourListUseCase,
  createDepartureTourUseCase,
  getDepartureTourUseCase,
  updateDepartureTourUseCase,
  deleteDepartureTourUseCase,
} = useCases;
