import GetTourPlanUseCaseImpl from './GetTourPlanUseCaseImpl';
import UpdateTourPlanUseCaseImpl from './UpdateTourPlanUseCaseImpl';
import { GetTourPlanUseCase } from './interfaces/GetTourPlanUseCase';
import { UpdateTourPlanUseCase } from './interfaces/UpdateTourPlanUseCase';
import GetEstimationListUseCaseImpl from './estimation/GetEstimationListUseCaseImpl';
import CreateEstimationUseCaseImpl from './estimation/CreateEstimationUseCaseImpl';
import GetEstimationUseCaseImpl from './estimation/GetEstimationUseCaseImpl';
import UpdateEstimationUseCaseImpl from './estimation/UpdateEstimationUseCaseImpl';
import DeleteEstimationUseCaseImpl from './estimation/DeleteEstimationUseCaseImpl';
import { GetEstimationListUseCase } from '../repositories/interfaces/estimation/GetEstimationListUseCase';
import { CreateEstimationUseCase } from '../repositories/interfaces/estimation/CreateEstimationUseCase';
import { GetEstimationUseCase } from '../repositories/interfaces/estimation/GetEstimationUseCase';
import { UpdateEstimationUseCase } from '../repositories/interfaces/estimation/UpdateEstimationUseCase';
import { DeleteEstimationUseCase } from '../repositories/interfaces/estimation/DeleteEstimationUseCase';

interface UseCases {
  getTourPlanUseCase: GetTourPlanUseCase,
  updateTourPlanUseCase: UpdateTourPlanUseCase,
  getEstimationListUseCase: GetEstimationListUseCase,
  createEstimationUseCase: CreateEstimationUseCase,
  getEstimationUseCase: GetEstimationUseCase,
  updateEstimationUseCase: UpdateEstimationUseCase,
  deleteEstimationUseCase: DeleteEstimationUseCase,
}

const useCases: UseCases = {
  getTourPlanUseCase: new GetTourPlanUseCaseImpl(),
  updateTourPlanUseCase: new UpdateTourPlanUseCaseImpl(),
  getEstimationListUseCase: new GetEstimationListUseCaseImpl(),
  createEstimationUseCase: new CreateEstimationUseCaseImpl(),
  getEstimationUseCase: new GetEstimationUseCaseImpl(),
  updateEstimationUseCase: new UpdateEstimationUseCaseImpl(),
  deleteEstimationUseCase: new DeleteEstimationUseCaseImpl(),
};

export const {
  getTourPlanUseCase,
  updateTourPlanUseCase,
  getEstimationListUseCase,
  createEstimationUseCase,
  getEstimationUseCase,
  updateEstimationUseCase,
  deleteEstimationUseCase,
} = useCases;
