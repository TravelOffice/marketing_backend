import DeleteOpportunityUseCaseImpl from './DeleteOpportunityUseCaseImpl';
import GetOpportunitiesByLeadUseCaseImpl from './GetOpportunitiesByLeadUseCaseImpl';
import GetOpportunityUseCaseImpl from './GetOpportunityUseCaseImpl';
import { DeleteOpportunityUseCase } from './interfaces/DeleteOpportunityUseCase';
import { GetOpportunitiesByLeadUseCase } from './interfaces/GetOpportunitiesByLeadUseCase';
import { GetOpportunityUseCase } from './interfaces/GetOpportunityUseCase';
import { UpdateOpportunityUseCase } from './interfaces/UpdateOpportunityUseCase';
import UpdateOpportunityUseCaseImpl from './UpdateOpportunityUseCaseImpl';

interface UseCases {
  getOpportunityUseCase: GetOpportunityUseCase,
  updateOpportunityUseCase: UpdateOpportunityUseCase,
  deleteOpportunityUseCase: DeleteOpportunityUseCase,
  getOpportunitiesByLeadUseCase: GetOpportunitiesByLeadUseCase,
}

const useCases : UseCases = {
  getOpportunityUseCase: new GetOpportunityUseCaseImpl(),
  updateOpportunityUseCase: new UpdateOpportunityUseCaseImpl(),
  deleteOpportunityUseCase: new DeleteOpportunityUseCaseImpl(),
  getOpportunitiesByLeadUseCase: new GetOpportunitiesByLeadUseCaseImpl(),
};

export const {
  getOpportunityUseCase,
  updateOpportunityUseCase,
  deleteOpportunityUseCase,
  getOpportunitiesByLeadUseCase,
} = useCases;
