import GetTourPlanUseCaseImpl from './GetTourPlanUseCaseImpl';
import UpdateTourPlanUseCaseImpl from './UpdateTourPlanUseCaseImpl';
import { GetTourPlanUseCase } from './interfaces/GetTourPlanUseCase';
import { UpdateTourPlanUseCase } from './interfaces/UpdateTourPlanUseCase';

interface UseCases {
  getTourPlanUseCase: GetTourPlanUseCase,
  updateTourPlanUseCase: UpdateTourPlanUseCase,
}

const useCases: UseCases = {
  getTourPlanUseCase: new GetTourPlanUseCaseImpl(),
  updateTourPlanUseCase: new UpdateTourPlanUseCaseImpl(),
};

export const {
  getTourPlanUseCase,
  updateTourPlanUseCase,
} = useCases;
