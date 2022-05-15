import DeleteOpportunityUseCaseImpl from './DeleteOpportunityUseCaseImpl';
import GetOpportunityUseCaseImpl from './GetOpportunityUseCaseImpl';
import { DeleteOpportunityUseCase } from './interfaces/DeleteOpportunityUseCase';
import { GetOpportunityUseCase } from './interfaces/GetOpportunityUseCase';
import { UpdateOpportunityUseCase } from './interfaces/UpdateOpportunityUseCase';
import UpdateOpportunityUseCaseImpl from './UpdateOpportunityUseCaseImpl';

interface UseCases {
  getOpportunityUseCase: GetOpportunityUseCase,
  updateOpportunityUseCase: UpdateOpportunityUseCase,
  deleteOpportunityUseCase: DeleteOpportunityUseCase,
}

const useCases : UseCases = {
  getOpportunityUseCase: new GetOpportunityUseCaseImpl(),
  updateOpportunityUseCase: new UpdateOpportunityUseCaseImpl(),
  deleteOpportunityUseCase: new DeleteOpportunityUseCaseImpl(),
};

export const {
  getOpportunityUseCase,
  updateOpportunityUseCase,
  deleteOpportunityUseCase,
} = useCases;
