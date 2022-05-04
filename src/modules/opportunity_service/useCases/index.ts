import GetOpportunityUseCaseImpl from './GetOpportunityUseCaseImpl';
import { GetOpportunityUseCase } from './interfaces/GetOpportunityUseCase';
import { UpdateOpportunityUseCase } from './interfaces/UpdateOpportunityUseCase';
import UpdateOpportunityUseCaseImpl from './UpdateOpportunityUseCaseImpl';

interface UseCases {
  getOpportunityUseCase: GetOpportunityUseCase,
  updateOpportunityUseCase: UpdateOpportunityUseCase,
}

const useCases : UseCases = {
  getOpportunityUseCase: new GetOpportunityUseCaseImpl(),
  updateOpportunityUseCase: new UpdateOpportunityUseCaseImpl(),
};

export const {
  getOpportunityUseCase,
  updateOpportunityUseCase,
} = useCases;
