// TODO: Declare use cases which can be used in this service here

import CreateQuoteUseCaseImpl from './CreateQuoteUseCaseImpl';
import DeleteQuoteUseCaseImpl from './DeleteQuoteUseCaseImpl';
import GetQuoteListUseCaseImpl from './GetQuoteListUseCaseImpl';
import GetQuoteUseCaseImpl from './GetQuoteUseCaseImpl';
import { CreateQuoteUseCase } from './interfaces/CreateQuoteUseCase';
import { DeleteQuoteUseCase } from './interfaces/DeleteQuoteUseCase';
import { GetQuoteListUseCase } from './interfaces/GetQuoteListUseCase';
import { GetQuoteUseCase } from './interfaces/GetQuoteUseCase';
import { UpdateQuoteUseCase } from './interfaces/UpdateQuoteUseCase';
import UpdateQuoteUseCaseImpl from './UpdateQuoteUseCaseImpl';
import { GetQuotesByOpportunityUseCase } from './interfaces/GetQuotesByOpportunityUseCase';
import GetQuotesByOpportunityUseCaseImpl from './GetQuotesByOpportunityUseCaseImpl';

interface UseCases {
  getQuoteListUseCase: GetQuoteListUseCase,
  createQuoteUseCase: CreateQuoteUseCase,
  getQuoteUseCase: GetQuoteUseCase,
  updateQuoteUseCase: UpdateQuoteUseCase,
  deleteQuoteUseCase: DeleteQuoteUseCase,
  getQuotesByOpportunityUseCase: GetQuotesByOpportunityUseCase,
}

const useCases : UseCases = {
  getQuoteListUseCase: new GetQuoteListUseCaseImpl(),
  createQuoteUseCase: new CreateQuoteUseCaseImpl(),
  getQuoteUseCase: new GetQuoteUseCaseImpl(),
  updateQuoteUseCase: new UpdateQuoteUseCaseImpl(),
  deleteQuoteUseCase: new DeleteQuoteUseCaseImpl(),
  getQuotesByOpportunityUseCase: new GetQuotesByOpportunityUseCaseImpl(),
};

export const {
  getQuoteListUseCase,
  createQuoteUseCase,
  getQuoteUseCase,
  updateQuoteUseCase,
  deleteQuoteUseCase,
  getQuotesByOpportunityUseCase,
} = useCases;
