import DeleteOpportunityUseCaseImpl from './DeleteOpportunityUseCaseImpl';
import GetMyOpportunitiesUseCaseImpl from './GetMyOpportunitiesUseCaseImpl';
import GetOpportunitiesByLeadUseCaseImpl from './GetOpportunitiesByLeadUseCaseImpl';
import GetOpportunityUseCaseImpl from './GetOpportunityUseCaseImpl';
import { DeleteOpportunityUseCase } from './interfaces/DeleteOpportunityUseCase';
import { GetMyOpportunitiesUseCase } from './interfaces/GetMyOpportunitiesUseCase';
import { GetOpportunitiesByLeadUseCase } from './interfaces/GetOpportunitiesByLeadUseCase';
import CreateOpportunityUseCaseImpl from './CreateOpportunityUseCaseImpl';
import { CreateOpportunityUseCase } from './interfaces/CreateOpportunityUseCase';
import { GetOpportunityUseCase } from './interfaces/GetOpportunityUseCase';
import { UpdateOpportunityUseCase } from './interfaces/UpdateOpportunityUseCase';
import UpdateOpportunityUseCaseImpl from './UpdateOpportunityUseCaseImpl';

interface UseCases {
  createOpportunityUseCase: CreateOpportunityUseCase,
  getOpportunityUseCase: GetOpportunityUseCase,
  updateOpportunityUseCase: UpdateOpportunityUseCase,
  deleteOpportunityUseCase: DeleteOpportunityUseCase,
  getOpportunitiesByLeadUseCase: GetOpportunitiesByLeadUseCase,
  getMyOpportunitiesUseCase: GetMyOpportunitiesUseCase,
}

const useCases : UseCases = {
  createOpportunityUseCase: new CreateOpportunityUseCaseImpl(),
  getOpportunityUseCase: new GetOpportunityUseCaseImpl(),
  updateOpportunityUseCase: new UpdateOpportunityUseCaseImpl(),
  deleteOpportunityUseCase: new DeleteOpportunityUseCaseImpl(),
  getOpportunitiesByLeadUseCase: new GetOpportunitiesByLeadUseCaseImpl(),
  getMyOpportunitiesUseCase: new GetMyOpportunitiesUseCaseImpl(),
};

export const {
  createOpportunityUseCase,
  getOpportunityUseCase,
  updateOpportunityUseCase,
  deleteOpportunityUseCase,
  getOpportunitiesByLeadUseCase,
  getMyOpportunitiesUseCase,
} = useCases;
